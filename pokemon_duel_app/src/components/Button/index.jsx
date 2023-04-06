import { useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import btn_background_img from "../../images/btn_background.png";
import styles from "./styles.module.css";

const Button = ({ name, type }) => {
  const { socket, navigate } = useContext(SocketContext);

  const handleChange = (type) => {
    socket.emit("room:create", { type }, (err, roomId) => {
      navigate(`/room/${roomId}`);
    });
  };

  return (
    <button className={styles.btn} onClick={() => handleChange(type)}>
      <img
        src={btn_background_img}
        alt="btn_background_img"
        className={styles.btn_background_img}
      />
      {name}
    </button>
  );
};

export default Button;