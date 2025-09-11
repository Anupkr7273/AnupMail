import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Trash() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchTrash = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/emails/trash", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmails(res.data);
      } catch (err) {
        console.error("Error fetching trash emails", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrash();
  }, [token]);

  const deletePermanently = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/emails/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmails(emails.filter(email => email._id !== id));
    } catch (err) {
      console.error("Error deleting email", err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">

          Trash
        </h1>
        {emails.length > 0 && (
          <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
            {emails.length} {emails.length === 1 ? 'item' : 'Emails'}
          </span>
        )}
      </div>
      
      {emails.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">Trash is empty</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {emails.map((email) => (
            <div key={email._id} className="p-4 border-b border-gray-100">
              <Link to={`/emails/${email._id}`} className="block mb-3 hover:text-blue-600 transition-colors">
                <h3 className="font-semibold text-gray-800">{email.subject}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {email.from === email.to ? "To yourself" : `From: ${email.from}`}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(email.createdAt).toLocaleString()}
                </p>
              </Link>
              
              <button
                onClick={() => deletePermanently(email._id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700 transition flex items-center"
              >
                Delete Permanently
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}