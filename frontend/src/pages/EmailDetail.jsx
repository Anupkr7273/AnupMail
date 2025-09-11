import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function EmailDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/emails/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmail(res.data);

        if (!res.data.read) {
          await markRead();
        }
      } catch (err) {
        console.error("Error fetching email", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmail();
  }, [id, navigate, token]);

  const markRead = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/emails/read/${id}`,
        { read: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmail(prev => ({ ...prev, read: true }));
    } catch (err) {
      console.error("Error marking email as read", err);
    }
  };

  const markUnread = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/emails/read/${id}`,
        { read: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmail(prev => ({ ...prev, read: false }));
    } catch (err) {
      console.error("Error marking email as unread", err);
    }
  };

  const moveToTrash = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/emails/trash/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/inbox");
    } catch (err) {
      console.error("Error moving email to trash", err);
    }
  };

  const deletePermanently = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/emails/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/trash");
    } catch (err) {
      console.error("Error deleting email permanently", err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!email) return <p className="p-6 text-center text-gray-500">Email not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{email.subject}</h1>
        
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">From:</span>
              <span className="ml-2 text-gray-800">{email.from}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">To:</span>
              <span className="ml-2 text-gray-800">{email.to}</span>
            </div>
            <div className="ml-auto">
              <span className="text-gray-500">
                {new Date(email.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="whitespace-pre-wrap text-gray-800 mb-8 leading-relaxed">
          {email.body}
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {email.folder === "trash" ? (
            <button
              onClick={deletePermanently}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Permanently
            </button>
          ) : (
            <>
              <button
                onClick={markUnread}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                Mark Unread
              </button>
              <button
                onClick={moveToTrash}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Move to Trash
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}