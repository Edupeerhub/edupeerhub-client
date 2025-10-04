import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useUsers } from "../../hooks/admin";

const PAGE_SIZE = 10;

function getUserName(user) {
  if (!user) return "—";
  if (user.fullName) return user.fullName;
  const nameParts = [user.firstName, user.lastName].filter(Boolean);
  if (nameParts.length) return nameParts.join(" ");
  return user.name || "—";
}

function formatDate(value) {
  if (!value) return "—";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "—";
    }
    return date.toLocaleDateString();
  } catch (error) {
    return "—";
  }
}

export default function AdminStudentsPage() {
  const [page, setPage] = useState(1);
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useUsers({ role: "student", page, limit: PAGE_SIZE });

  const students = data?.users ?? [];
  const meta = data?.meta;

  const totalStudents = meta?.total ?? students.length ?? 0;
  const pageSize = meta?.limit ?? PAGE_SIZE;
  const computedTotalPages = pageSize
    ? Math.ceil(totalStudents / pageSize)
    : Math.ceil(totalStudents / PAGE_SIZE);
  const totalPages = Math.max(1, computedTotalPages || 1);
  const currentPage = meta?.page ?? page;
  const currentCount = meta?.count ?? students.length ?? 0;
  const hasResults = totalStudents > 0 && currentCount > 0;
  const effectivePageSize = pageSize || PAGE_SIZE;
  const rangeStart = hasResults ? (currentPage - 1) * effectivePageSize + 1 : 0;
  const rangeEnd = hasResults
    ? (currentPage - 1) * effectivePageSize + currentCount
    : 0;

  useEffect(() => {
    if (meta?.page && meta.page !== page) {
      setPage(meta.page);
    }
  }, [meta?.page]);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-semibold">Students</h1>
        <p className="text-sm text-gray-500 mt-2">
          Manage registered students and review their onboarding details.
        </p>
      </div>

      <div className="p-6">
        {isError ? <ErrorAlert error={error} /> : null}

        {isLoading ? (
          <Spinner />
        ) : students.length === 0 ? (
          <p className="text-sm text-gray-500">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Date Joined</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const status = student?.accountStatus || student?.status || "—";
                  return (
                    <tr
                      key={student?.id ?? index}
                      className={index < students.length - 1 ? "border-b" : ""}
                    >
                      <td className="p-4 text-gray-700">{getUserName(student)}</td>
                      <td className="p-4 text-gray-600">{student?.email ?? "—"}</td>
                      <td className="p-4 text-gray-600">
                        {formatDate(student?.createdAt)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs rounded-full ${
                            status === "active"
                              ? "bg-green-100 text-green-700"
                              : status === "inactive"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          className="px-4 py-2 bg-white border rounded-full shadow-sm text-blue-600"
                          to={`/admin/students/${student?.id}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {isFetching && !isLoading ? (
          <div className="mt-4">
            <Spinner />
          </div>
        ) : null}

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            {totalStudents === 0
              ? "Showing 0 students"
              : `Showing ${rangeStart} to ${rangeEnd} of ${totalStudents} students`}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
