import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.firstName || 'there'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Let&apos;s build something amazing today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Completed</div>
          <div className="text-3xl font-bold">0</div>
          <div className="text-xs text-gray-400 mt-1">tutorials</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">In Progress</div>
          <div className="text-3xl font-bold">0</div>
          <div className="text-xs text-gray-400 mt-1">projects</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Learning Time</div>
          <div className="text-3xl font-bold">0h</div>
          <div className="text-xs text-gray-400 mt-1">this week</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Next.js App Router Guide</h3>
                  <p className="text-sm text-gray-500 mt-1">Learn the basics of App Router</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Free</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Stripe Payments Integration</h3>
                  <p className="text-sm text-gray-500 mt-1">Add payments to your app</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Pro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-gray-500 text-center py-8">
            No recent activity yet. Start learning!
          </div>
        </div>
      </div>
    </div>
  );
}
