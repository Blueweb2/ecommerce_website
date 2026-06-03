const fs = require('fs');
const path = require('path');

// 1. Update orders page
const ordersPagePath = 'e:/nextjsprojects/ecommerce/ecommerce-frontend/app/admin/orders/page.tsx';
let ordersCode = fs.readFileSync(ordersPagePath, 'utf8');

// Add customerType state
if (!ordersCode.includes('const [customerType')) {
  ordersCode = ordersCode.replace(
    'const [activeStatus, setActiveStatus] = useState("all");',
    'const [activeStatus, setActiveStatus] = useState("all");\n  const [customerType, setCustomerType] = useState<"all" | "guest" | "registered">("all");'
  );
}

// Update useEffect to include customerType
ordersCode = ordersCode.replace(
  '  useEffect(() => {\n    fetchOrders();\n  }, [fetchOrders]);',
  '  useEffect(() => {\n    fetchOrders(1, 10, customerType === "all" ? undefined : customerType);\n  }, [fetchOrders, customerType]);'
);

// Update search logic to include guest email
ordersCode = ordersCode.replace(
  '          (userObj?.email?.toLowerCase().includes(query))',
  '          (userObj?.email?.toLowerCase().includes(query)) ||\n          (order.guestEmail?.toLowerCase().includes(query))'
);

// Add customer type dropdown
if (!ordersCode.includes('value={customerType}')) {
  ordersCode = ordersCode.replace(
    '            {/* 🔥 REFUND FILTER BUTTONS WITH COUNT */}',
    `            {/* CUSTOMER TYPE FILTER */}
            <select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value as any)}
              className="border px-3 py-2 rounded text-sm bg-white"
            >
              <option value="all">All Customers</option>
              <option value="guest">Guest Orders</option>
              <option value="registered">Registered Orders</option>
            </select>
            
            {/* 🔥 REFUND FILTER BUTTONS WITH COUNT */}`
  );
}

// Update table cell
const oldUserCell = `                    {/* USER */}
                    <td className="p-4">
                      {order.user && typeof order.user === "object" ? (
                        <>
                          <p>{order.user?.name}</p>
                          <p className="text-xs text-gray-500">{order.user?.email}</p>
                        </>
                      ) : "Unknown"}
                    </td>`;

const newUserCell = `                    {/* USER */}
                    <td className="p-4">
                      {order.isGuestOrder ? (
                        <>
                          <p className="font-medium text-slate-800">Guest</p>
                          <p className="text-xs text-gray-500">{order.guestEmail}</p>
                          <span className="px-2 py-0.5 bg-gray-200 text-xs rounded-full inline-block mt-1 text-gray-700">Guest Order</span>
                        </>
                      ) : order.user && typeof order.user === "object" ? (
                        <>
                          <p className="font-medium text-slate-800">{order.user?.name}</p>
                          <p className="text-xs text-gray-500">{order.user?.email}</p>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full inline-block mt-1">Registered</span>
                        </>
                      ) : "Unknown"}
                    </td>`;

ordersCode = ordersCode.replace(oldUserCell, newUserCell);
fs.writeFileSync(ordersPagePath, ordersCode);

// 2. Update order details page
const detailsPagePath = 'e:/nextjsprojects/ecommerce/ecommerce-frontend/app/admin/orders/[id]/page.tsx';
let detailsCode = fs.readFileSync(detailsPagePath, 'utf8');

const oldCustomerDetails = `            {order.user && typeof order.user !== "string" ? (
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-800">Name:</span>{" "}
                  {order.user.name}
                </p>
                <p>
                  <span className="font-medium text-slate-800">Email:</span>{" "}
                  {order.user.email}
                </p>
                <p>
                  <span className="font-medium text-slate-800">User ID:</span>{" "}
                  {order.user._id}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Customer details unavailable</p>
            )}`;

const newCustomerDetails = `            {order.isGuestOrder ? (
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-800">Type:</span>{" "}
                  <span className="px-2 py-0.5 bg-gray-200 text-xs rounded-full text-gray-700">Guest</span>
                </p>
                <p>
                  <span className="font-medium text-slate-800">Guest Email:</span>{" "}
                  {order.guestEmail}
                </p>
              </div>
            ) : order.user && typeof order.user !== "string" ? (
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-800">Type:</span>{" "}
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Registered User</span>
                </p>
                <p>
                  <span className="font-medium text-slate-800">Name:</span>{" "}
                  {order.user.name}
                </p>
                <p>
                  <span className="font-medium text-slate-800">Email:</span>{" "}
                  {order.user.email}
                </p>
                <p>
                  <span className="font-medium text-slate-800">User ID:</span>{" "}
                  {order.user._id}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Customer details unavailable</p>
            )}`;

detailsCode = detailsCode.replace(oldCustomerDetails, newCustomerDetails);
fs.writeFileSync(detailsPagePath, detailsCode);

// 3. Update dashboard page
const dashboardPath = 'e:/nextjsprojects/ecommerce/ecommerce-frontend/app/admin/dashboard/page.tsx';
let dashboardCode = fs.readFileSync(dashboardPath, 'utf8');

const oldDashboardStats = `        <div className="p-5 bg-white rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
        </div>

      </div>`;

const newDashboardStats = `        <div className="p-5 bg-white rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
        </div>
        
        <div className="p-5 bg-white rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Guest Orders</p>
          <h2 className="text-2xl font-bold">{stats.guestOrders}</h2>
        </div>
        
        <div className="p-5 bg-white rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Registered Orders</p>
          <h2 className="text-2xl font-bold">{stats.registeredOrders}</h2>
        </div>
        
        <div className="p-5 bg-white rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Guest Conv. Rate</p>
          <h2 className="text-2xl font-bold">{stats.guestConversionRate.toFixed(1)}%</h2>
        </div>

      </div>`;

dashboardCode = dashboardCode.replace(oldDashboardStats, newDashboardStats);

// make sure the grid accounts for 6 cards now
dashboardCode = dashboardCode.replace('grid-cols-1 md:grid-cols-3', 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6');

fs.writeFileSync(dashboardPath, dashboardCode);

console.log("Updated frontend admin pages successfully.");
