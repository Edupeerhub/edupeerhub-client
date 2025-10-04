import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import {
  usePendingTutors,
  useUserCounts,
  useUsers,
} from "../../hooks/admin";

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
    data: students,
    isLoading: isLoadingStudents,
    isError: isStudentsError,
    error: studentsError,
  } = useUsers({ role: "student" });

  const statCards = useMemo(
    () => [
      {
        title: "Total Tutors",
        value: formatNumber(
          counts?.totalTutors ?? counts?.tutorCount ?? counts?.tutors,
        ),
        delta: counts?.tutorGrowth ?? "—",
        deltaClass:
          typeof counts?.tutorGrowth === "number" && counts?.tutorGrowth < 0
            ? "text-red-500"
            : "text-green-600",
      },
      {
        title: "Total Students",
        value: formatNumber(
          counts?.totalStudents ?? counts?.studentCount ?? counts?.students,
        ),
        delta: counts?.studentGrowth ?? "—",
        deltaClass:
          typeof counts?.studentGrowth === "number" && counts?.studentGrowth < 0
            ? "text-red-500"
            : "text-green-600",
      },
      {
        title: "Pending Tutor Application",
        value: formatNumber(
          counts?.pendingTutors ?? counts?.pendingTutorCount ?? 0,
        ),
        delta: counts?.pendingTutorGrowth ?? "—",
        deltaClass:
          typeof counts?.pendingTutorGrowth === "number" &&
          counts?.pendingTutorGrowth < 0
            ? "text-green-600"
            : "text-red-500",
      },
    ],
    [counts],
  );

  const pendingTutorPreview = useMemo(
    () => (pendingTutors ?? []).slice(0, PREVIEW_LIMIT),
    [pendingTutors],
  );

  const studentPreview = useMemo(
    () => (students ?? []).slice(0, PREVIEW_LIMIT),
    [students],
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
                  {card.delta ?? "—"}
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
        {isPendingTutorsError ? <ErrorAlert error={pendingTutorsError} /> : null}
        {isLoadingPendingTutors ? (
          <Spinner />
        ) : pendingTutorPreview.length === 0 ? (
          <p className="text-sm text-gray-500">No pending tutors at the moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-4">Name</th>
                  <th className="p-4">University</th>
                  <th className="p-4">Date Applied</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingTutorPreview.map((tutor, index) => {
                  const university =
                    tutor?.tutorProfile?.university || tutor?.university || "—";
                  return (
                    <tr
                      key={tutor?.id ?? index}
                      className={
                        index < pendingTutorPreview.length - 1 ? "border-b" : ""
                      }
                    >
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
                          {getUserName(tutor)
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2) || "U"}
                        </div>
                        <div className="text-sm text-gray-700">
                          {getUserName(tutor)}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{university}</td>
                      <td className="p-4 text-gray-600">
                        {formatDate(tutor?.createdAt || tutor?.appliedAt)}
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
                  <th className="p-4">Completed sections</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {studentPreview.map((student, index) => {
                  const status = student?.accountStatus || student?.status || "—";
                  return (
                    <tr
                      key={student?.id ?? index}
                      className={
                        index < studentPreview.length - 1 ? "border-b" : ""
                      }
                    >
                      <td className="p-4 text-gray-700">{getUserName(student)}</td>
                      <td className="p-4 text-gray-600">
                        {formatDate(student?.createdAt)}
                      </td>
                      <td className="p-4 text-gray-600">
                        {student?.completedSections ?? "—"}
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
