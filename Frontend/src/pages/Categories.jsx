import {
  Link,
} from 'react-router-dom';


// ======================================================
// CATEGORIES
// ======================================================

const categories = [

  {
    name: 'Courier Bags',
    slug: 'Courier Bags',
    icon: '📦',
    description:
      'Strong and lightweight courier bags for secure business shipments.',
  },

  {
    name: 'Boxes',
    slug: 'Boxes',
    icon: '🗃️',
    description:
      'Durable packaging boxes available for different business requirements.',
  },

  {
    name: 'Tapes',
    slug: 'Tapes',
    icon: '📏',
    description:
      'Reliable packaging tapes for sealing parcels and shipments.',
  },

  {
    name: 'Labels & Stickers',
    slug: 'Labels',
    icon: '🏷️',
    description:
      'Professional labels and stickers for packaging and order processing.',
  },

  {
    name: 'Paper Shredded',
    slug: 'Paper Shredded',
    icon: '📄',
    description:
      'Shredded paper packaging material for safe product protection.',
  },

];


// ======================================================
// POPULAR CATEGORIES
// ======================================================

const popularCategories = [
  'Courier Bags',
  'Boxes',
  'Tapes',
  'Labels',
];


// ======================================================
// CATEGORY CARD
// ======================================================

const CategoryCard = ({
  category,
}) => {

  return (

    <Link
      to={`/products?category=${encodeURIComponent(
        category.slug
      )}`}
      className="
        group
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-6
        hover:border-teal-400
        hover:shadow-xl
        transition-all
        duration-300
      "
    >

      {/* ==================================================
          ICON
      ================================================== */}

      <div
        className="
          w-16
          h-16
          rounded-2xl
          bg-teal-50
          flex
          items-center
          justify-center
          text-3xl
          group-hover:scale-110
          transition-transform
        "
      >

        {category.icon}

      </div>


      {/* ==================================================
          NAME
      ================================================== */}

      <h2
        className="
          text-lg
          font-bold
          text-slate-800
          mt-5
          group-hover:text-teal-700
          transition-colors
        "
      >

        {category.name}

      </h2>


      {/* ==================================================
          DESCRIPTION
      ================================================== */}

      <p
        className="
          text-sm
          text-slate-500
          leading-6
          mt-2
        "
      >

        {category.description}

      </p>


      {/* ==================================================
          ACTION
      ================================================== */}

      <span
        className="
          inline-flex
          items-center
          gap-1
          mt-5
          text-sm
          font-semibold
          text-teal-700
        "
      >

        Explore Products

        <span
          className="
            group-hover:translate-x-1
            transition-transform
          "
        >

          →

        </span>

      </span>

    </Link>

  );

};


// ======================================================
// CATEGORIES PAGE
// ======================================================

const Categories = () => {

  return (

    <div
      className="
        min-h-screen
        bg-slate-50
      "
    >

      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="
          bg-gradient-to-br
          from-teal-700
          via-teal-600
          to-slate-900
          text-white
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            py-14
            sm:py-20
          "
        >

          <div
            className="
              max-w-3xl
            "
          >

            <p
              className="
                text-sm
                font-semibold
                text-teal-100
                uppercase
                tracking-wider
              "
            >

              Business Packaging Solutions

            </p>


            <h1
              className="
                text-3xl
                sm:text-5xl
                font-extrabold
                mt-3
                leading-tight
              "
            >

              Shop by Category

            </h1>


            <p
              className="
                mt-4
                text-sm
                sm:text-base
                text-teal-50
                leading-7
                max-w-2xl
              "
            >

              Explore our range of packaging products
              designed for retailers, resellers,
              online sellers and growing businesses.

            </p>

          </div>

        </div>

      </section>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main
        className="
          max-w-7xl
          mx-auto
          px-4
          py-12
        "
      >

        {/* ==================================================
            POPULAR CATEGORIES
        ================================================== */}

        <section>

          <div
            className="
              flex
              items-end
              justify-between
              gap-4
              mb-6
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-teal-600
                "
              >

                Popular

              </p>


              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-slate-900
                  mt-1
                "
              >

                Popular Categories

              </h2>

            </div>

          </div>


          <div
            className="
              flex
              flex-wrap
              gap-3
            "
          >

            {popularCategories.map(
              (category) => (

                <Link
                  key={
                    category
                  }
                  to={`/products?category=${encodeURIComponent(
                    category
                  )}`}
                  className="
                    px-5
                    py-2.5
                    rounded-full
                    bg-white
                    border
                    border-slate-200
                    text-sm
                    font-semibold
                    text-slate-700
                    hover:border-teal-500
                    hover:text-teal-700
                    hover:bg-teal-50
                    transition-colors
                  "
                >

                  {category}

                </Link>

              )
            )}

          </div>

        </section>


        {/* ==================================================
            ALL CATEGORIES
        ================================================== */}

        <section
          className="
            mt-12
          "
        >

          <div
            className="
              mb-7
            "
          >

            <p
              className="
                text-sm
                font-semibold
                text-teal-600
              "
            >

              Explore

            </p>


            <h2
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-slate-900
                mt-1
              "
            >

              All Categories

            </h2>


            <p
              className="
                text-sm
                text-slate-500
                mt-2
              "
            >

              Find the right packaging products
              for your business.

            </p>

          </div>


          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-5
            "
          >

            {categories.map(
              (category) => (

                <CategoryCard
                  key={
                    category.name
                  }
                  category={
                    category
                  }
                />

              )
            )}

          </div>

        </section>


        {/* ==================================================
            BULK CTA
        ================================================== */}

        <section
          className="
            mt-12
            rounded-3xl
            overflow-hidden
            bg-gradient-to-r
            from-teal-700
            to-slate-900
            text-white
          "
        >

          <div
            className="
              p-7
              sm:p-10
              lg:p-12
              flex
              flex-col
              lg:flex-row
              items-center
              justify-between
              gap-6
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-teal-100
                "
              >

                Buying in Bulk?

              </p>


              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  mt-1
                "
              >

                Get Better Wholesale Pricing

              </h2>


              <p
                className="
                  text-sm
                  text-teal-50
                  mt-2
                  max-w-xl
                  leading-6
                "
              >

                Need a large quantity? Upload your
                requirement or request a quotation
                from our team.

              </p>

            </div>


            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-3
                shrink-0
              "
            >

              <Link
                to="/bulk-order-upload"
                className="
                  px-5
                  py-3
                  rounded-xl
                  bg-white
                  text-teal-700
                  font-bold
                  text-sm
                  text-center
                  hover:bg-teal-50
                  transition-colors
                "
              >

                Bulk Order

              </Link>


              <Link
                to="/my-rfqs"
                className="
                  px-5
                  py-3
                  rounded-xl
                  border
                  border-white/30
                  bg-white/10
                  font-bold
                  text-sm
                  text-center
                  hover:bg-white/20
                  transition-colors
                "
              >

                Request Quote

              </Link>

            </div>

          </div>

        </section>

      </main>

    </div>

  );

};


export default Categories;