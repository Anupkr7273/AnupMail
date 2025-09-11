import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Sent() {
  const { token } = useContext(AuthContext);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/emails/sent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmails(res.data);
      } catch (err) {
        console.error("Error fetching sent emails", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSent();
  }, [token]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          Sent Emails
        </h1>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
          {emails.length} {emails.length === 1 ? 'Emails' : 'Emails'}
        </span>
      </div>
      
      {emails.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">

          <p className="text-gray-500 text-lg">No sent emails yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {emails.map((email) => (
            <div
              key={email._id}
              onClick={() => navigate(`/emails/${email._id}`)}
              className="p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 mb-1">To: {email.to}</p>
                  <h3 className="text-gray-800 font-medium truncate">{email.subject}</h3>
                  <p className="text-gray-600 text-sm truncate mt-1">{email.body}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(email.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-gray-400 text-right">
                    {new Date(email.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}