import { useState, useEffect } from "react";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const request = await fetch(
        "https://jsonplaceholder.typicode.com/comments"
      );
      if (request.ok) {
        const response = await request.json();
        setComments(response);
      } else {
        throw new Error("Error fetching comments");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="space-y-8">
      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {comments.length > 0 ? (
          comments.map((s) => (
            <div
              key={s.postId}
              className="bg-white rounded-xl p-5 shadow-sm border"
            >
              <div className="text-sm text-gray-500">{s.namr}</div>
              <div className="mt-3 text-2xl font-semibold">{s.email}</div>
              <div className={`mt-2 text-sm`}>{s.body}</div>
            </div>
          ))
        ) : (
          <p>No Comments available</p>
        )}
      </div>
    </div>
  );
}
