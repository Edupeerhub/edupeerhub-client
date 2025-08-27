import { useState } from "react";
import Layout from "../../layouts/Layout";

const DemoPage = ({ title, content, fullHeight = false }) => (
  <Layout title={title} fullHeight={fullHeight}>
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${
        fullHeight ? "h-full" : ""
      }`}
    >
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      <div className={`p-6 ${fullHeight ? "flex-1" : ""}`}>{content}</div>
    </div>
  </Layout>
);

const StudentDashboardPage = () => {
  const [currentView, setCurrentView] = useState("scrollable");

  if (currentView === "scrollable") {
    return (
      <DemoPage
        title="Scrollable Content Demo"
        fullHeight={false}
        content={
          <div className="space-y-6">
            <p className="text-gray-600">
              This is a <strong>scrollable layout</strong>. The content can be
              longer than the screen and will scroll normally. The sidebar and
              navbar stay fixed in position.
            </p>

            <button
              onClick={() => setCurrentView("fullHeight")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Switch to Full Height Layout
            </button>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Features of this layout:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Sidebar slides in/out on mobile with hamburger menu</li>
                <li>Always visible on desktop (lg: screens and up)</li>
                <li>Dark overlay on mobile when sidebar is open</li>
                <li>Smooth animations with Tailwind transitions</li>
                <li>Content scrolls naturally when it exceeds screen height</li>
              </ul>
            </div>

            {/* Extra content to demonstrate scrolling */}
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded border">
                <h4 className="font-medium">Content Block {i + 1}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  This is some sample content to demonstrate scrolling behavior.
                  The navbar stays fixed at the top and sidebar stays fixed on
                  the left.
                </p>
              </div>
            ))}
          </div>
        }
      />
    );
  }

  return (
    <DemoPage
      title="Full Height Layout Demo"
      fullHeight={true}
      content={
        <div className="h-full flex flex-col">
          <p className="text-gray-600 mb-4">
            This is a <strong>full height layout</strong>. The content area
            takes up the full remaining screen height. Perfect for dashboards or
            apps where you want precise control over the layout height.
          </p>

          <button
            onClick={() => setCurrentView("scrollable")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-6"
          >
            Switch to Scrollable Layout
          </button>

          <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">📐</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Full Height Content
              </h3>
              <p className="text-gray-600">
                This area fills the remaining screen space
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default StudentDashboardPage;
