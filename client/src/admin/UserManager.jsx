import React, { useState } from "react";

const UserManagement = ({ users, setUsers }) => {
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);

  const filteredUsers = users.filter((user) => {
    const matchesRole =
      roleFilter === "All Roles" || user.role === roleFilter;

    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRole && matchesSearch;
  });

  const toggleUserStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" }
          : u
      )
    );
  };

  const handleResetPassword = () => {
    setTimeout(() => {
      alert(`Password reset link sent to ${resetUser.email}`);
      setResetUser(null);
    }, 400);
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 gowun-dodum-regular px-3 sm:px-4 md:px-0 text-[#E3D5C3]">

      {/* HEADER */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4">
        

        <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto">
          <select
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-[#5b3d25] rounded-lg text-sm sm:text-base bg-[#E3D5C3] text-[#442314]"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option className="gowun-dodum-regular text-[#442314]">All Roles</option>
            <option className="gowun-dodum-regular text-[#442314]">Admin</option>
            <option className="gowun-dodum-regular text-[#442314]">Moderator</option>
            <option className="gowun-dodum-regular text-[#442314]">Customer</option>
          </select>

          <input
            type="text"
            placeholder="Search Users..."
            className="px-3 sm:px-4 py-1.5 sm:py-2 border text-[#452215] rounded-lg text-sm sm:text-base  border-[#452215] shadow-[4px_4px_0_#8F5E41] bg-[#FFE9D5] flex items-center"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* USER TABLE */}
      <div className="overflow-x-auto -mx-3 sm:-mx-4 md:mx-0">
        <div className="min-w-[640px] sm:min-w-0">
          <table className="w-full bg-[#E3D5C3] text-[#442314] rounded-lg">
            <thead>
              <tr className="border-b border-[#5b3d25]">
                <th className="text-left py-2 px-4 text-xs sm:text-sm">Name</th>
                <th className="text-left py-2 px-4 text-xs sm:text-sm">Email</th>
                <th className="text-left py-2 px-4 text-xs sm:text-sm">Role</th>
                <th className="text-left py-2 px-4 text-xs sm:text-sm">Status</th>
                <th className="text-left py-2 px-4 text-xs sm:text-sm">Last Login</th>
                <th className="text-left py-2 px-4 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#5b3d25]/30 hover:bg-[#5b3d25]/5 transition"
                >
                  <td className="py-3 px-4 text-xs sm:text-sm">{user.name}</td>
                  <td className="py-3 px-4 text-xs sm:text-sm">{user.email}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs sm:text-sm ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "Moderator"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs sm:text-sm ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-xs sm:text-sm">
                    {user.lastLogin}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-col xs:flex-row gap-2">

                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className="px-3 py-1 border  text-[#5b3d25] rounded text-xs sm:text-sm relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] duration-300  hover:-translate-y-1"
                      >
                        {user.status === "Active" ? "Block" : "Unblock"}
                      </button>

                      <button
                        onClick={() => setResetUser(user)}
                        className="px-3 py-1 bg-[#5b3d25] text-[#E3D5C3] rounded text-xs sm:text-sm  border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] duration-300  hover:-translate-y-1"
                      >
                        Reset Password
                      </button>

                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-3 py-1  rounded text-xs sm:text-sm bg-[#F0A322]  border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215]  duration-300  hover:-translate-y-1"
                      >
                        View
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESET PASSWORD MODAL */}
      {resetUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#E3D5C3] p-5 rounded-xl w-[90%] max-w-sm text-[#442314]">
            <h3 className="text-lg font-semibold mb-3">
              Reset Password
            </h3>

            <p className="text-sm mb-4">
              Send password reset link to <strong>{resetUser.email}</strong>?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setResetUser(null)}
                className="px-4 py-2 rounded-lg active:translate-y-1  w-full   border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215]  duration-300  hover:-translate-y-1 cursor-pointer "
              >
                Cancel
              </button>

              <button
                onClick={handleResetPassword}
                className="px-4 py-2 rounded-lg w-full bg-[#F0A322] active:translate-y-1  border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215]  duration-300  hover:-translate-y-1 cursor-pointer  "
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW USER – CENTER MODAL (REPLACED SIDEBAR) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#E3D5C3] w-[90%] max-w-md p-6 rounded-xl shadow-xl text-[#442314]">

            <h3 className="text-xl font-semibold text-[#5b3d25] mb-4 text-center">
              User Details
            </h3>

            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <p><strong>Last Login:</strong> {selectedUser.lastLogin}</p>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 px-4 py-2 active:translate-y-1 rounded-lg w-full bg-[#F0A322]  border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215]  duration-300  hover:-translate-y-1 cursor-pointer "
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
