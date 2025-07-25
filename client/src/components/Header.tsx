const Header = () => {

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center" >
            <img src={require('../assets/cashflow.png')} alt="Image" className='flex justify-center items-center ml-[35%]' />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Gestionnaire de Tâches
            </h1>
            <p className="text-gray-600">
                Organisez et suivez vos tâches d'équipe efficacement
            </p>
        </div >
    );
};

export default Header;