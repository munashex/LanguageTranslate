import Logo from '../assets/solation.png'

const Navbar = () => {

    return (
        <div className="border">
        <div className="mx-1  md:mx-4 lg:mx-16">
          <img src={Logo} alt="Linguary" 
          className="w-52 md:w-64 cursor-pointer"
          />
        </div> 
        </div>
    )
}

export default Navbar