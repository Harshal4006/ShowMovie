import AdminSidebar from "../../Components/Admin/AdminSidebar/AdminSidebar";
import useTheaters from "../../Components/Admin/ManageTheaters/useTheaters";
import TheaterHeader from "../../Components/Admin/ManageTheaters/TheaterHeader";
import TheaterSearchBar from "../../Components/Admin/ManageTheaters/TheaterSearchBar";
import TheaterDesktopTable from "../../Components/Admin/ManageTheaters/TheaterDesktopTable";
import TheaterMobileList from "../../Components/Admin/ManageTheaters/TheaterMobileList";
import TheaterEmptyState from "../../Components/Admin/ManageTheaters/TheaterEmptyState";
import TheaterFormModal from "../../Components/Admin/ManageTheaters/TheaterFormModal";

const ManageTheaters = () => {
  const {
    theaters, loading, showForm, setShowForm, editing,
    form, setForm, searchTerm, setSearchTerm,
    filtered, openCreate, openEdit, handleSubmit, handleDelete,
  } = useTheaters();

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <AdminSidebar />
      <main className="flex-1 w-full lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <TheaterHeader count={theaters.length} onAdd={openCreate} />

          <TheaterSearchBar value={searchTerm} onChange={setSearchTerm} />

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            </div>
          ) : filtered.length > 0 ? (
            <>
              <TheaterDesktopTable theaters={filtered} onEdit={openEdit} onDelete={handleDelete} />
              <TheaterMobileList theaters={filtered} onEdit={openEdit} onDelete={handleDelete} />
            </>
          ) : (
            <TheaterEmptyState hasSearch={!!searchTerm} />
          )}
        </div>
      </main>

      <TheaterFormModal
        isOpen={showForm}
        editing={editing}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
};

export default ManageTheaters;
