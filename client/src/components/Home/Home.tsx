import background from "../../img/background.svg"

export const Home = () => {
  return (
    <div>
      <p className="italic text-2xl">asdasdasdasdss</p>
      <section className="hero ontainer max-w-screen-lg mx-auto pb-10 flex justify-cecnter bg-slate-900">
        <img src={background} alt="backgound"></img>
      </section>
      <div className="flex justify-cecnter">
        <img className="h-48 w-20 object-cover" src={background} alt="screenshot"></img>
      </div>
    </div>
  )
}
