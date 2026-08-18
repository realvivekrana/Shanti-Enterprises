const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const ContactEnquiry = require('../models/ContactEnquiry');
const sendEmail = require('../utils/sendEmail');
const { contactAcknowledgementTemplate } = require('../utils/emailTemplates');

const submitEnquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    throw new ApiError(400, 'Name, email, and message are required');
  }

  const enquiry = await ContactEnquiry.create({ name, email, phone, subject, message });

  sendEmail({
    to: email,
    subject: 'We received your enquiry - Shanti Enterprises',
    html: contactAcknowledgementTemplate(name),
  });

  res.status(201).json(new ApiResponse(201, enquiry, 'Your enquiry has been submitted'));
});

const getEnquiries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const enquiries = await ContactEnquiry.find(filter).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, enquiries, 'Enquiries fetched'));
});

const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['New', 'In Progress', 'Resolved'].includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  const enquiry = await ContactEnquiry.findById(req.params.id);
  if (!enquiry) throw new ApiError(404, 'Enquiry not found');

  enquiry.status = status;
  await enquiry.save();

  res.status(200).json(new ApiResponse(200, enquiry, 'Enquiry status updated'));
});

module.exports = { submitEnquiry, getEnquiries, updateEnquiryStatus };