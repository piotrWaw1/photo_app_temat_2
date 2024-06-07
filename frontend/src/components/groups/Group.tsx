import ManageGroups from "./groupComponents/ManageGroups.tsx";
import ManageImages from "./groupComponents/ManageImages.tsx";

export default function Group() {

  return (
      <>
        <h1 className="border-bottom pb-3 text-center">Group title</h1>
        <ManageGroups/>
        <ManageImages/>
      </>
  )
}