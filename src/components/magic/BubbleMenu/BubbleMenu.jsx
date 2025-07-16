
import './StyleBubbleMenu.scss';

const BubbleMenu = () => {

  const handleClickHome = (e) => {
    e.target.parentNode.classList.toggle('open');
  }
  
  return (
    <>
      <div className="fourinone">
        <a href="#" className="fourinone-btn"><span className="fa fa-question"></span></a>
        <a href="#" className="fourinone-btn"><span className="fa fa-exclamation"></span></a>
        <a href="#" className="fourinone-btn"><span className="fa fa-code"></span></a>
        <a href="#" className="fourinone-btn"><span className="fa fa-codepen"></span></a>
        <div className="trigger" onClick={handleClickHome}>
          <span className="fa fa-home"></span>
        </div>
      </div>
    </>
  );
}

export default BubbleMenu;