import Home from "../components/Home";








import Feature from "../components/Feature";
import Courses from "../components/Courses";
import Testi from "../components/Testi";

const HomePage = () => {
  return (
    <>
      <section>
        <Home />
      </section>
      <section>
        <Feature />
      </section>
      <section>
        <Courses />
      </section>
      <section>
        <Testi />
      </section>
    </>
  );
};

export default HomePage;
