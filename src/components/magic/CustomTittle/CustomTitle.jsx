
import './StyleCustomTitle.scss';

const CustomTittle = ({ title }) => {
  
  return (
    <div className="custom-title">
      <h1 className="main-title">{ title }</h1>
    </div>
  );
}

export default CustomTittle;