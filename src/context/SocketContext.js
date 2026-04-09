import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAdmissionAdvice } from '../context/AdmissionAdviceContext';
import socket from "../context/socket";

const SocketContext = () => {
  const { setAdviceData } = useAdmissionAdvice();

useEffect(() => {
  socket.emit('joinReceptionistRoom');

  socket.on('newIPDAdmissionAdvice', (data) => {
      console.log("🔥 SOCKET RECEIVED:", data);
    toast.info(`Doctor advised admission for Patient ID: ${data.patientName}`);
    setAdviceData(data); // 🌟 store the socket data globally
  });

  return () => {
    socket.off('newIPDAdmissionAdvice');
  };
}, []);


  return null;
};

export default SocketContext;
