import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { usePendingTutors, useUserCounts, useUsers } from "../../hooks/admin";

const PREVIEW_LIMIT = 5;

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "0";
  }

  return new Intl.NumberFormat().format(value);
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

function getUserName(user) {
  if (!user) return "—";
  if (user.fullName) return user.fullName;
  const nameParts = [user.firstName, user.lastName].filter(Boolean);
  if (nameParts.length) return nameParts.join(" ");
  return user.name || "—";
}

function StatCard({ title, value, delta, deltaClass }) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-3 text-2xl font-semibold text-gray-900">{value}</div>
      <div className={`mt-2 text-sm ${deltaClass}`}>{delta}</div>
    </div>
  );
}

function TableHeader({ cols }) {
  return (
    <thead>
      <tr className="bg-blue-50">
        {cols.map((c) => (
          <th key={c} className="px-6 py-4 text-left text-sm text-gray-700">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function ViewButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full border bg-white text-blue-600 shadow-sm hover:bg-gray-50"
    >
      View
    </button>
  );
}

export default function AdminDashboardPage() {
  const {
    data: counts,
    isLoading: isLoadingCounts,
    isError: isCountsError,
    error: countsError,
  } = useUserCounts();
  const {
    data: pendingTutors,
    isLoading: isLoadingPendingTutors,
    isError: isPendingTutorsError,
    error: pendingTutorsError,
  } = usePendingTutors();
  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    isError: isStudentsError,
    error: studentsError,
  } = useUsers({ role: "student", limit: PREVIEW_LIMIT });

  const students = studentsData?.users ?? [];

  const pendingCount = counts?.totals?.totalPendingTutors ?? 0;
  const tutorCount = counts?.totals?.totalTutors ?? 0;
  const studentCount = counts?.totals?.totalStudents ?? 0;

  const statCards = useMemo(
    () => [
      {
        title: "Total Tutors",
        value: formatNumber(tutorCount),
        delta: counts?.growth?.tutors ?? null,
        deltaClass:
          typeof counts?.growth?.tutors === "number" &&
          counts?.growth?.tutors < 0
            ? "text-red-500"
            : "text-green-600",
      },
      {
        title: "Total Students",
        value: formatNumber(studentCount),
        delta: counts?.growth?.students ?? null,
        deltaClass:
          typeof counts?.growth?.students === "number" &&
          counts?.growth?.students < 0
            ? "text-red-500"
            : "text-green-600",
      },
      {
        title: "Pending Tutor Application",
        value: formatNumber(pendingCount),
        delta: counts?.growth?.pendingTutors ?? null,
        deltaClass:
          typeof counts?.growth?.pendingTutors === "number" &&
          counts?.growth?.pendingTutors < 0
            ? "text-green-600"
            : "text-red-500",
      },
    ],
    [counts]
  );

  const pendingTutorPreview = useMemo(
    () => (pendingTutors ?? []).slice(0, PREVIEW_LIMIT),
    [pendingTutors]
  );

  const studentPreview = useMemo(
    () => (students ?? []).slice(0, PREVIEW_LIMIT),
    [students]
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {isCountsError ? (
          <div className="sm:col-span-3">
            <ErrorAlert error={countsError} />
          </div>
        ) : null}
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl p-5 shadow-sm border min-h-[120px] flex flex-col justify-between"
          >
            <div className="text-sm text-gray-500">{card.title}</div>
            {isLoadingCounts ? (
              <div className="py-4">
                <Spinner />
              </div>
            ) : (
              <>
                <div className="mt-3 text-2xl font-semibold">{card.value}</div>
                <div className={`mt-2 text-sm ${card.deltaClass}`}>
                  {card.delta != null ? `${card.delta}%` : "—"}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <section className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Pending Tutors Approval</h3>
          <Link className="text-sm text-blue-600" to="/admin/tutors">
            View All
          </Link>
        </div>
        {isPendingTutorsError ? (
          <ErrorAlert error={pendingTutorsError} />
        ) : null}
        {isLoadingPendingTutors ? (
          <Spinner />
        ) : pendingTutorPreview.length === 0 ? (
          <p className="text-sm text-gray-500">
            No pending tutors at the moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-4">Name</th>
                  <th className="p-4">Bio</th>
                  <th className="p-4">Date Applied</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingTutorPreview.map((tutor, index) => {
                  return (
                    <tr
                      key={tutor?.id ?? index}
                      className={
                        index < pendingTutorPreview.length - 1 ? "border-b" : ""
                      }
                    >
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={tutor.user.profileImageUrl}
                          alt={`${tutor.user.firstName} ${tutor.user.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="text-sm text-gray-700">
                          {getUserName(tutor)}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{tutor?.bio}</td>
                      <td className="p-4 text-gray-600">
                        {formatDate(tutor?.user.createdAt)}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          className="px-4 py-2 bg-white border rounded-full shadow-sm text-blue-600"
                          to={`/admin/tutors/${tutor?.id}`}
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
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Registered students</h3>
          <Link className="text-sm text-blue-600" to="/admin/students">
            View All
          </Link>
        </div>
        {isStudentsError ? <ErrorAlert error={studentsError} /> : null}
        {isLoadingStudents ? (
          <Spinner />
        ) : studentPreview.length === 0 ? (
          <p className="text-sm text-gray-500">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-4">Name</th>
                  <th className="p-4">Date Joined</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {studentPreview.map((student, index) => {
                  const status =
                    student?.accountStatus || student?.status || "—";
                  return (
                    <tr
                      key={student?.id ?? index}
                      className={
                        index < studentPreview.length - 1 ? "border-b" : ""
                      }
                    >
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={student.profileImageUrl}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {getUserName(student)}
                      </td>
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
                          {status ?? "—"}
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
      </section>
    </div>
  );
}
