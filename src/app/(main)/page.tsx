import FilterSidebar from "./post-job/_components/FilterSidebar";
import JobListing from "./post-job/_components/JobListing";

export default async function Homepage({
  searchParams,
}: {
  searchParams: Promise<{ jobType: string; location: string }>;
}) {

  const {jobType, location} = await searchParams
  return (
    <div className="grid grid-cols-3 gap-8 my-8">
      <FilterSidebar />

      <div className="col-span-2 flex flex-col gap-6">
        <JobListing jobType={jobType} location={location} />
      </div>
    </div>
  );
}
