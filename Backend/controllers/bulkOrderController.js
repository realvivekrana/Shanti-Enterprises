const XLSX = require('xlsx');

const asyncHandler =
  require('../utils/asyncHandler');

const ApiError =
  require('../utils/ApiError');

const ApiResponse =
  require('../utils/ApiResponse');

const Product =
  require('../models/Product');


// ======================================================
// HELPER
// NORMALIZE HEADER
// ======================================================

const normalizeHeader = (header) => {

  return String(header || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '');
};


// ======================================================
// FIND COLUMN
// ======================================================

const findColumn = (
  headers,
  possibleNames
) => {

  return headers.find(
    (header) => {

      const normalized =
        normalizeHeader(header);

      return possibleNames.includes(
        normalized
      );

    }
  );

};


// ======================================================
// NORMALIZE SKU
// ======================================================

const normalizeSku = (sku) => {

  return String(sku || '')
    .trim()
    .toUpperCase();

};


// ======================================================
// NORMALIZE QUANTITY
// ======================================================

const normalizeQuantity = (
  quantity
) => {

  if (
    quantity === null ||
    quantity === undefined ||
    quantity === ''
  ) {

    return NaN;

  }


  // Handle values like:
  // "500"
  // "500.00"

  const parsed =
    Number(
      String(quantity)
        .replace(/,/g, '')
        .trim()
    );


  return parsed;

};


// ======================================================
// BULK ORDER UPLOAD
// ======================================================

const uploadBulkOrder =
  asyncHandler(
    async (req, res) => {

      // ==================================================
      // FILE CHECK
      // ==================================================

      if (!req.file) {

        throw new ApiError(
          400,
          'Please upload a CSV or Excel file.'
        );

      }


      // ==================================================
      // READ WORKBOOK
      // ==================================================

      let workbook;

      try {

        workbook =
          XLSX.read(
            req.file.buffer,
            {
              type: 'buffer',
            }
          );

      } catch (error) {

        throw new ApiError(
          400,
          'Unable to read the uploaded file. Please upload a valid CSV or Excel file.'
        );

      }


      // ==================================================
      // CHECK SHEET
      // ==================================================

      if (
        !workbook.SheetNames ||
        workbook.SheetNames.length === 0
      ) {

        throw new ApiError(
          400,
          'The uploaded file does not contain any worksheet.'
        );

      }


      const firstSheetName =
        workbook.SheetNames[0];

      const worksheet =
        workbook.Sheets[
          firstSheetName
        ];


      // ==================================================
      // CONVERT SHEET TO JSON
      // ==================================================

      const rows =
        XLSX.utils.sheet_to_json(
          worksheet,
          {
            defval: '',
            raw: false,
          }
        );


      // ==================================================
      // EMPTY FILE
      // ==================================================

      if (
        !rows ||
        rows.length === 0
      ) {

        throw new ApiError(
          400,
          'The uploaded file is empty.'
        );

      }


      // ==================================================
      // FIND HEADERS
      // ==================================================

      const headers =
        Object.keys(rows[0] || {});


      const skuColumn =
        findColumn(
          headers,
          [
            'sku',
            'productsku',
            'itemsku',
            'productcode',
            'itemcode',
          ]
        );


      const quantityColumn =
        findColumn(
          headers,
          [
            'quantity',
            'qty',
            'orderquantity',
            'orderqty',
          ]
        );


      // ==================================================
      // HEADER VALIDATION
      // ==================================================

      if (!skuColumn) {

        throw new ApiError(
          400,
          'SKU column is missing. Please use a column named SKU.'
        );

      }


      if (!quantityColumn) {

        throw new ApiError(
          400,
          'Quantity column is missing. Please use a column named Quantity.'
        );

      }


      // ==================================================
      // PROCESS ROWS
      // ==================================================

      const parsedRows = [];

      const invalidRows = [];


      rows.forEach(
        (row, index) => {

          const excelRowNumber =
            index + 2;


          const sku =
            normalizeSku(
              row[skuColumn]
            );


          const quantity =
            normalizeQuantity(
              row[quantityColumn]
            );


          // ----------------------------------------------
          // EMPTY ROW
          // ----------------------------------------------

          if (
            !sku &&
            (
              row[quantityColumn] === '' ||
              row[quantityColumn] === null ||
              row[quantityColumn] === undefined
            )
          ) {

            return;

          }


          // ----------------------------------------------
          // SKU REQUIRED
          // ----------------------------------------------

          if (!sku) {

            invalidRows.push({

              row:
                excelRowNumber,

              sku:
                '',

              quantity:
                Number.isNaN(quantity)
                  ? ''
                  : quantity,

              reason:
                'SKU is missing.',

            });

            return;

          }


          // ----------------------------------------------
          // QUANTITY REQUIRED
          // ----------------------------------------------

          if (
            Number.isNaN(quantity)
          ) {

            invalidRows.push({

              row:
                excelRowNumber,

              sku,

              quantity:
                row[quantityColumn] || '',

              reason:
                'Quantity must be a valid number.',

            });

            return;

          }


          // ----------------------------------------------
          // INTEGER CHECK
          // ----------------------------------------------

          if (
            !Number.isInteger(quantity)
          ) {

            invalidRows.push({

              row:
                excelRowNumber,

              sku,

              quantity,

              reason:
                'Quantity must be a whole number.',

            });

            return;

          }


          // ----------------------------------------------
          // POSITIVE CHECK
          // ----------------------------------------------

          if (
            quantity <= 0
          ) {

            invalidRows.push({

              row:
                excelRowNumber,

              sku,

              quantity,

              reason:
                'Quantity must be greater than 0.',

            });

            return;

          }


          parsedRows.push({

            row:
              excelRowNumber,

            sku,

            quantity,

          });

        }
      );


      // ==================================================
      // NOTHING VALID TO PROCESS
      // ==================================================

      if (
        parsedRows.length === 0
      ) {

        return res.status(200).json(

          new ApiResponse(
            200,
            {
              success: false,

              totalRows:
                rows.length,

              validRows:
                0,

              addedItems:
                [],

              invalidItems:
                invalidRows,

            },
            'No valid order rows found.'
          )

        );

      }


      // ==================================================
      // COMBINE DUPLICATE SKUs
      // ==================================================

      const skuMap =
        new Map();


      parsedRows.forEach(
        (item) => {

          if (
            skuMap.has(
              item.sku
            )
          ) {

            const existing =
              skuMap.get(
                item.sku
              );


            existing.quantity +=
              item.quantity;


            existing.rows.push(
              item.row
            );

          } else {

            skuMap.set(
              item.sku,
              {
                sku:
                  item.sku,

                quantity:
                  item.quantity,

                rows: [
                  item.row,
                ],
              }
            );

          }

        }
      );


      const uniqueItems =
        Array.from(
          skuMap.values()
        );


      // ==================================================
      // FIND PRODUCTS
      // ==================================================

      const skuList =
        uniqueItems.map(
          (item) =>
            item.sku
        );


      const products =
        await Product.find({

          sku: {
            $in: skuList,
          },

        }).lean();


      // ==================================================
      // CREATE PRODUCT MAP
      // ==================================================

      const productMap =
        new Map();


      products.forEach(
        (product) => {

          productMap.set(
            normalizeSku(
              product.sku
            ),
            product
          );

        }
      );


      // ==================================================
      // RESULT ARRAYS
      // ==================================================

      const addedItems = [];

      const unavailableItems = [];


      // ==================================================
      // VALIDATE EACH SKU
      // ==================================================

      uniqueItems.forEach(
        (item) => {

          const product =
            productMap.get(
              item.sku
            );


          // ----------------------------------------------
          // PRODUCT NOT FOUND
          // ----------------------------------------------

          if (!product) {

            unavailableItems.push({

              row:
                item.rows.join(', '),

              sku:
                item.sku,

              quantity:
                item.quantity,

              reason:
                'SKU not found.',

            });

            return;

          }


          const moq =
            Number(
              product.moq || 1
            );


          const stock =
            Number(
              product.stock || 0
            );


          // ----------------------------------------------
          // MOQ CHECK
          // ----------------------------------------------

          if (
            item.quantity < moq
          ) {

            unavailableItems.push({

              row:
                item.rows.join(', '),

              sku:
                item.sku,

              quantity:
                item.quantity,

              productName:
                product.name,

              reason:
                `Minimum order quantity is ${moq}.`,

              moq,

              stock,

            });

            return;

          }


          // ----------------------------------------------
          // STOCK CHECK
          // ----------------------------------------------

          if (
            item.quantity > stock
          ) {

            unavailableItems.push({

              row:
                item.rows.join(', '),

              sku:
                item.sku,

              quantity:
                item.quantity,

              productName:
                product.name,

              reason:
                `Only ${stock} pieces are available.`,

              moq,

              stock,

            });

            return;

          }


          // ----------------------------------------------
          // VALID PRODUCT
          // ----------------------------------------------

          addedItems.push({

            product: {

              _id:
                product._id,

              name:
                product.name,

              sku:
                product.sku,

              description:
                product.description,

              category:
                product.category,

              brand:
                product.brand,

              price:
                product.price,

              moq:
                product.moq,

              stock:
                product.stock,

              gst:
                product.gst,

              images:
                product.images || [],

              wholesalePricing:
                product.wholesalePricing || [],

            },

            quantity:
              item.quantity,

            sourceRows:
              item.rows,

          });

        }
      );


      // ==================================================
      // FINAL RESPONSE
      // ==================================================

      return res.status(200).json(

        new ApiResponse(

          200,

          {

            success:
              addedItems.length > 0,

            totalRows:
              rows.length,

            validRows:
              addedItems.length,

            invalidRows:
              invalidRows.length,

            unavailableRows:
              unavailableItems.length,

            addedItems,

            invalidItems:
              invalidRows,

            unavailableItems,

          },

          addedItems.length > 0
            ? 'Bulk order file processed successfully.'
            : 'Bulk order file processed, but no products could be added.'

        )

      );

    }
  );


module.exports = {
  uploadBulkOrder,
};