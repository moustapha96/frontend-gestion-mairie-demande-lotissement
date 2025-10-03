import { LuLineChart, LuMail, LuPhone, LuSave } from "react-icons/lu";

const Contact = () => {
  return (


    <section id="contact" className="py-10 lg:py-20">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Actualités</span>
          <h2 className="text-4xl font-medium text-default-950 mt-4">Nous contacter</h2>
        </div>
        <div className="flex flex-wrap items-center justify-around gap-6 mt-5 ">
          <div className="text-center">
            <div className="h-20 w-20 rounded-md border border-default-200 text-default-950 bg-white/5 mx-auto flex items-center justify-center">
              <LuPhone className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-medium text-default-950 mt-5">
             Appeler nous
            </h4>
            <p className="text-base  text-default-800 mt-1">33 941 12 56 / 33 941 15 35</p>
          </div>
          <div className="text-center">
            <div className="h-20 w-20 rounded-md border border-default-200 text-default-950 bg-white/5 mx-auto flex items-center justify-center">
              <LuMail className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-medium text-default-950 mt-5">
              Email me
            </h4>
            <p className="text-base  text-default-800 mt-1">support@kaolackcommune.sn</p>
          </div>
          <div className="text-center">
            <div className="h-20 w-20 rounded-md border border-default-200 text-default-950 bg-white/5 mx-auto flex items-center justify-center">
              <LuLineChart className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-medium text-default-950 mt-5">
           Suiver nous
            </h4>
            <p className="text-base  text-default-800 mt-1">Facebook.com</p>
          </div>
          {/* <div className="text-center">
            <div className="h-20 w-20 rounded-md border border-default-200 text-default-950 bg-white/5 mx-auto flex items-center justify-center">
              <LuSave className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-medium text-default-950 mt-5">
              My Work
            </h4>
            <p className="text-base  text-default-800 mt-1">Coderthemes.com</p>
          </div> */}
        </div>
      </div>
    </section>



  );
};

export default Contact;
