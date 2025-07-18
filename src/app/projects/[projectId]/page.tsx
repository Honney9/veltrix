import { ProjectView } from "@/modules/projects/ui/views/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { notFound } from "next/navigation"; // built-in Next.js handler
import {ErrorBoundary} from "react-error-boundary"

interface Props{
    params: Promise<{
        projectId: string;
    }>
}

const Page=async ({params}: Props)=>{
    const {projectId} = await params;

    const queryClient =  getQueryClient();


    void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({
        projectId,
    }));

    try {
        await queryClient.prefetchQuery(
        trpc.projects.getOne.queryOptions({
            id: projectId,
        })
        );
    } catch (err) {
        return notFound(); // Or show your own custom error component
  }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary fallback={<p>Error!</p>}>
                <Suspense fallback= {<p>Loading Project.....</p>}>
                    <ProjectView projectId={projectId} />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    )
} 

export default Page;