import Navigation from "@/components/navigation"
import {Skeleton} from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation/>

            <main className="mx-auto max-w-[1600px] px-3 pb-16 pt-4 sm:px-4 sm:pt-6 lg:px-8 lg:pt-8">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2">
                    <Skeleton className="h-3.5 w-16"/>
                    <Skeleton className="h-3.5 w-3"/>
                    <Skeleton className="h-3.5 w-24"/>
                </div>

                {/* Header */}
                <div className="mb-6 rounded-3xl border border-border/60 bg-card px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
                    <Skeleton className="h-3 w-28"/>
                    <Skeleton className="mt-3 h-9 w-2/3 max-w-md"/>
                    <Skeleton className="mt-3 h-4 w-full max-w-lg"/>
                    <div className="mt-5 flex gap-2">
                        <Skeleton className="h-6 w-36 rounded-full"/>
                        <Skeleton className="h-6 w-36 rounded-full"/>
                        <Skeleton className="hidden h-6 w-32 rounded-full sm:block"/>
                    </div>
                </div>

                {/* Brands */}
                <div className="mb-6 rounded-3xl border border-border/60 bg-card p-5">
                    <Skeleton className="h-3 w-16"/>
                    <Skeleton className="mt-2 h-5 w-40"/>
                    <div className="mt-4 flex gap-3 overflow-hidden">
                        {Array.from({length: 8}).map((_, index) => (
                            <div key={index} className="flex flex-col items-center gap-2">
                                <Skeleton className="size-16 rounded-2xl sm:size-[72px]"/>
                                <Skeleton className="h-3 w-12"/>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-start gap-6">
                    {/* Sidebar */}
                    <div className="hidden w-[264px] shrink-0 rounded-3xl border border-border/60 bg-card p-3 lg:block">
                        <Skeleton className="mb-4 h-4 w-24"/>
                        <div className="space-y-1.5">
                            {Array.from({length: 9}).map((_, index) => (
                                <Skeleton key={index} className="h-10 w-full rounded-xl"/>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                        {/* Toolbar */}
                        <div className="mb-5 rounded-2xl border border-border/60 bg-card p-4">
                            <div className="flex flex-col gap-2.5 sm:flex-row">
                                <Skeleton className="h-11 flex-1 rounded-xl"/>
                                <Skeleton className="h-11 w-full rounded-xl sm:w-[190px]"/>
                            </div>
                            <div className="mt-3 flex items-center gap-3 border-t border-border/50 pt-3">
                                <Skeleton className="h-4 w-24"/>
                                <Skeleton className="h-6 w-24 rounded-full"/>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({length: 12}).map((_, index) => (
                                <div
                                    key={index}
                                    className="overflow-hidden rounded-3xl border border-border/60 bg-card"
                                >
                                    <Skeleton className="aspect-square w-full rounded-none"/>
                                    <div className="space-y-3 p-4">
                                        <Skeleton className="h-3.5 w-full"/>
                                        <Skeleton className="h-3.5 w-2/3"/>
                                        <Skeleton className="mt-1 h-5 w-24"/>
                                        <Skeleton className="h-10 w-full rounded-xl"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
