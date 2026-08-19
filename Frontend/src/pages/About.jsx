import {
  Link,
} from 'react-router-dom';


// ======================================================
// ABOUT PAGE
// ======================================================

const About = () => {

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
            py-16
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
                uppercase
                tracking-wider
                text-teal-100
              "
            >

              About Shanti Enterprises

            </p>


            <h1
              className="
                mt-3
                text-3xl
                sm:text-5xl
                font-extrabold
                leading-tight
              "
            >

              Your Trusted Partner
              for Business Packaging

            </h1>


            <p
              className="
                mt-5
                text-sm
                sm:text-base
                leading-7
                text-teal-50
                max-w-2xl
              "
            >

              We help businesses source quality
              packaging products at competitive
              wholesale prices with a simple and
              reliable buying experience.

            </p>


            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-3
                mt-7
              "
            >

              <Link
                to="/products"
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-white
                  text-teal-700
                  text-sm
                  font-bold
                  text-center
                  hover:bg-teal-50
                  transition-colors
                "
              >

                Explore Products

              </Link>


              <Link
                to="/bulk-order-upload"
                className="
                  px-6
                  py-3
                  rounded-xl
                  border
                  border-white/30
                  bg-white/10
                  text-white
                  text-sm
                  font-bold
                  text-center
                  hover:bg-white/20
                  transition-colors
                "
              >

                Bulk Order

              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          WHO WE ARE
      ================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          py-14
          sm:py-16
        "
      >

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-10
            items-center
          "
        >

          {/* LEFT */}

          <div>

            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-wider
                text-teal-600
              "
            >

              Who We Are

            </p>


            <h2
              className="
                mt-2
                text-2xl
                sm:text-3xl
                font-extrabold
                text-slate-900
              "
            >

              Making Wholesale
              Buying Simple

            </h2>


            <p
              className="
                mt-5
                text-sm
                text-slate-600
                leading-7
              "
            >

              Shanti Enterprises is focused on
              helping businesses purchase packaging
              products efficiently and at wholesale
              prices.

            </p>


            <p
              className="
                mt-4
                text-sm
                text-slate-600
                leading-7
              "
            >

              From courier bags and packaging boxes
              to tapes, labels and other packaging
              materials, our goal is to make business
              procurement easier for retailers,
              resellers and online sellers.

            </p>


            <p
              className="
                mt-4
                text-sm
                text-slate-600
                leading-7
              "
            >

              Whether you need a regular stock
              purchase or a large bulk order, our
              platform is designed to provide a
              straightforward purchasing experience.

            </p>

          </div>


          {/* RIGHT */}

          <div
            className="
              grid
              grid-cols-2
              gap-4
            "
          >

            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-6
                shadow-sm
              "
            >

              <div
                className="
                  text-3xl
                "
              >

                📦

              </div>


              <h3
                className="
                  mt-4
                  font-bold
                  text-slate-800
                "
              >

                Quality Products

              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  text-slate-500
                  leading-5
                "
              >

                Products selected for
                business packaging needs.

              </p>

            </div>


            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-6
                shadow-sm
              "
            >

              <div
                className="
                  text-3xl
                "
              >

                💰

              </div>


              <h3
                className="
                  mt-4
                  font-bold
                  text-slate-800
                "
              >

                Wholesale Pricing

              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  text-slate-500
                  leading-5
                "
              >

                Better pricing for
                business purchases.

              </p>

            </div>


            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-6
                shadow-sm
              "
            >

              <div
                className="
                  text-3xl
                "
              >

                🚚

              </div>


              <h3
                className="
                  mt-4
                  font-bold
                  text-slate-800
                "
              >

                Business Delivery

              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  text-slate-500
                  leading-5
                "
              >

                Reliable shipping support
                for business orders.

              </p>

            </div>


            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-6
                shadow-sm
              "
            >

              <div
                className="
                  text-3xl
                "
              >

                🤝

              </div>


              <h3
                className="
                  mt-4
                  font-bold
                  text-slate-800
                "
              >

                Business Support

              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  text-slate-500
                  leading-5
                "
              >

                Support for wholesale
                and bulk requirements.

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          OUR MISSION
      ================================================== */}

      <section
        className="
          bg-white
          border-y
          border-slate-200
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            py-14
            sm:py-16
          "
        >

          <div
            className="
              max-w-3xl
              mx-auto
              text-center
            "
          >

            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-wider
                text-teal-600
              "
            >

              Our Mission

            </p>


            <h2
              className="
                mt-2
                text-2xl
                sm:text-3xl
                font-extrabold
                text-slate-900
              "
            >

              Helping Businesses Buy Better

            </h2>


            <p
              className="
                mt-5
                text-sm
                sm:text-base
                text-slate-500
                leading-7
              "
            >

              Our mission is to make wholesale
              procurement more transparent,
              convenient and accessible for
              businesses of different sizes.

            </p>

          </div>


          {/* ==================================================
              VALUES
          ================================================== */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-5
              mt-10
            "
          >

            <div
              className="
                text-center
                p-6
                rounded-2xl
                bg-slate-50
              "
            >

              <div
                className="
                  text-3xl
                "
              >

                🎯

              </div>


              <h3
                className="
                  mt-4
                  font-bold
                  text-slate-800
                "
              >

                Customer Focus

              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  text-slate-500
                  leading-5
                "
              >

                Understanding business needs
                and providing useful solutions.

              </p>

            </div>


            <div
              className="
                text-center
                p-6
                rounded-2xl
                bg-slate-50
              "
            >

              <div
                className="
                  text-3xl
                "
              >

                🔍

              </div>


              <h3
                className="
                  mt-4
                  font-bold
                  text-slate-800
                "
              >

                Transparency

              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  text-slate-500
                  leading-5
                "
              >

                Clear product, pricing and
                order information.

              </p>

            </div>


            <div
              className="
                text-center
                p-6
                rounded-2xl
                bg-slate-50
              "
            >

              <div
                className="
                  text-3xl
                "
              >

                ⚡

              </div>


              <h3
                className="
                  mt-4
                  font-bold
                  text-slate-800
                "
              >

                Efficiency

              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  text-slate-500
                  leading-5
                "
              >

                Simple ordering for faster
                business procurement.

              </p>

            </div>


            <div
              className="
                text-center
                p-6
                rounded-2xl
                bg-slate-50
              "
            >

              <div
                className="
                  text-3xl
                "
              >

                🤝

              </div>


              <h3
                className="
                  mt-4
                  font-bold
                  text-slate-800
                "
              >

                Long-Term Partnership

              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  text-slate-500
                  leading-5
                "
              >

                Building lasting relationships
                with business customers.

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          HOW WE HELP
      ================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          py-14
          sm:py-16
        "
      >

        <div
          className="
            text-center
            max-w-2xl
            mx-auto
          "
        >

          <p
            className="
              text-sm
              font-bold
              uppercase
              tracking-wider
              text-teal-600
            "
          >

            Why Businesses Choose Us

          </p>


          <h2
            className="
              mt-2
              text-2xl
              sm:text-3xl
              font-extrabold
              text-slate-900
            "
          >

            Built for Wholesale Buying

          </h2>

        </div>


        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
            mt-10
          "
        >

          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-7
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-teal-50
                flex
                items-center
                justify-center
                text-2xl
              "
            >

              🛒

            </div>


            <h3
              className="
                mt-5
                font-bold
                text-slate-800
              "
            >

              Easy Ordering

            </h3>


            <p
              className="
                mt-2
                text-sm
                text-slate-500
                leading-6
              "
            >

              Browse products, select quantities,
              add them to your cart and complete
              your business order easily.

            </p>

          </div>


          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-7
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-teal-50
                flex
                items-center
                justify-center
                text-2xl
              "
            >

              📋

            </div>


            <h3
              className="
                mt-5
                font-bold
                text-slate-800
              "
            >

              Bulk & RFQ Support

            </h3>


            <p
              className="
                mt-2
                text-sm
                text-slate-500
                leading-6
              "
            >

              For larger requirements, businesses
              can use bulk ordering and request
              special quotations.

            </p>

          </div>


          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-7
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-teal-50
                flex
                items-center
                justify-center
                text-2xl
              "
            >

              📊

            </div>


            <h3
              className="
                mt-5
                font-bold
                text-slate-800
              "
            >

              Business-Friendly Features

            </h3>


            <p
              className="
                mt-2
                text-sm
                text-slate-500
                leading-6
              "
            >

              Wholesale pricing, MOQ, order tracking
              and other features are designed
              around business requirements.

            </p>

          </div>

        </div>

      </section>


      {/* ==================================================
          CTA
      ================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          pb-14
          sm:pb-16
        "
      >

        <div
          className="
            rounded-3xl
            bg-gradient-to-r
            from-teal-700
            to-slate-900
            text-white
            p-8
            sm:p-12
            text-center
          "
        >

          <h2
            className="
              text-2xl
              sm:text-3xl
              font-extrabold
            "
          >

            Ready to Start Buying Wholesale?

          </h2>


          <p
            className="
              mt-3
              text-sm
              text-teal-50
              max-w-xl
              mx-auto
              leading-6
            "
          >

            Explore our products or send us your
            bulk requirement to get started.

          </p>


          <div
            className="
              flex
              flex-col
              sm:flex-row
              justify-center
              gap-3
              mt-7
            "
          >

            <Link
              to="/products"
              className="
                px-6
                py-3
                rounded-xl
                bg-white
                text-teal-700
                font-bold
                text-sm
                hover:bg-teal-50
                transition-colors
              "
            >

              Shop Products

            </Link>


            <Link
              to="/bulk-order-upload"
              className="
                px-6
                py-3
                rounded-xl
                border
                border-white/30
                bg-white/10
                font-bold
                text-sm
                hover:bg-white/20
                transition-colors
              "
            >

              Bulk Order

            </Link>

          </div>

        </div>

      </section>

    </div>

  );

};


export default About;