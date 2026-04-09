import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAdmissionAdvice } from '../context/AdmissionAdviceContext';
import socket from "../context/socket";

const SocketContext = () => {
  const { setAdviceData } = useAdmissionAdvice();

  useEffect(() => {

    // ✅ WAIT for connection FIRST
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      // ✅ NOW emit (correct timing)
      socket.emit('joinReceptionistRoom');
      console.log("📤 joinReceptionistRoom emitted");
    });

    // ✅ RECEIVE EVENT
    socket.on('newIPDAdmissionAdvice', (data) => {
      console.log("🔥 SOCKET RECEIVED:", data);

      toast.info(`Doctor advised admission for Patient: ${data.patientName}`);

      setAdviceData(data); // 🌟 store globally
    });

    return () => {
      socket.off("connect");
      socket.off('newIPDAdmissionAdvice');
    };
  }, []);

  return null;
};

export default SocketContext;