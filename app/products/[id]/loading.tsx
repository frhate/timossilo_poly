import Navigation from "@/components/navigation"
import {Skeleton} from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation/>

            <div className="container mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6">
                {/* Breadcrumb */}
                <div className="mb-6 flex flex-wrap items-center gap-2">
                    <Skeleton className="h-3.5 w-16"/>
                    <Skeleton className="h-3.5 w-3"/>
                    <Skeleton className="h-3.5 w-24"/>
                    <Skeleton className="h-3.5 w-3"/>
                    <Skeleton className="h-3.5 w-40"/>
                </div>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,470px)] lg:gap-12 xl:gap-16">
                    {/* Gallery */}
                    <div className="space-y-4">
                        <Skeleton className="aspect-square w-full rounded-[2rem]"/>
                        <div className="flex gap-3">
                            {Array.from({length: 4}).map((_, index) => (
                                <Skeleton key={index} className="size-18 rounded-2xl sm:size-20"/>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-5">
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-24 rounded-full"/>
                            <Skeleton className="h-6 w-28 rounded-full"/>
                        </div>
                        <Skeleton className="h-10 w-4/5"/>
                        <Skeleton className="h-12 w-1/2"/>
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-40 rounded-full"/>
                            <Skeleton className="h-6 w-32 rounded-full"/>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full"/>
                            <Skeleton className="h-4 w-full"/>
                            <Skeleton className="h-4 w-2/3"/>
                        </div>

                        <div className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6">
                            <Skeleton className="h-10 w-full rounded-xl"/>
                            <Skeleton className="mt-4 h-16 w-full rounded-2xl"/>
                            <Skeleton className="mt-4 h-14 w-full rounded-2xl"/>
                            <Skeleton className="mt-3 h-12 w-full rounded-2xl"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
