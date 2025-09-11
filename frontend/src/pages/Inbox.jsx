import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Inbox() {
  const { token } = useContext(AuthContext);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/emails/inbox", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmails(res.data);
      } catch (err) {
        console.error("Error fetching inbox:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, [token]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Inbox
        </h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {emails.length} {emails.length === 1 ? 'email' : 'Emails'}
        </span>
      </div>
      
      {emails.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-lg">No emails in your inbox</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {emails.map((mail) => (
            <div
              key={mail._id}
              onClick={() => navigate(`/emails/${mail._id}`)}
              className="p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 truncate mr-2">From: {mail.from}</span>
                    {!mail.read && (
                      <span className="bg-green-500 h-2 w-2 rounded-full flex-shrink-0"></span>
                    )}
                  </div>
                  <h3 className={`text-gray-800 font-medium truncate ${!mail.read ? 'font-semibold' : ''}`}>
                    {mail.subject}
                  </h3>
                  <p className="text-gray-600 text-sm truncate mt-1">{mail.body}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(mail.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-gray-400 text-right">
                    {new Date(mail.createdAt).toLocaleDateString()}
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

export default Inbox;