"use client";

import { useEffect } from "react";

const masterMarkup = `

    <!-- Background Ambient Glows -->
    <div class="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-50/60 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-50/60 rounded-full blur-[120px]"></div>
    </div>

    <!-- Navigation (Fixed Centering) -->
    <!-- Changed: Removed 'left-1/2 -translate-x-1/2' and used 'w-full flex justify-center' to avoid transform conflict -->
    <nav class="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
        <div class="pointer-events-auto reveal-scale active flex items-center gap-1 p-1.5 pl-4 pr-1.5 bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-full shadow-xl shadow-zinc-200/40 ring-1 ring-white/50">
            <!-- Logo -->
            <div class="flex items-center gap-2 mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="palmtree" class="lucide lucide-palmtree w-4 h-4 text-emerald-600 stroke-[1.5]"><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"></path><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3"></path><path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35"></path><path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14"></path></svg>
                <span class="text-sm font-semibold tracking-tight text-zinc-900">ROSALT.</span>
            </div>
            
            <!-- Links (Hidden Mobile) -->
            <div class="hidden md:flex items-center gap-1">
                <a href="/__LOCALE__/services" class="hover:text-zinc-900 transition-colors hover:bg-zinc-50 text-xs font-medium text-zinc-500 rounded-full pt-1.5 pr-3 pb-1.5 pl-3">Services</a>
                <a href="/__LOCALE__/property-management" class="hover:text-zinc-900 transition-colors hover:bg-zinc-50 text-xs font-medium text-zinc-500 rounded-full pt-1.5 pr-3 pb-1.5 pl-3">Management</a>
                <a href="/__LOCALE__/maison-ai" class="hover:text-zinc-900 transition-colors hover:bg-zinc-50 text-xs font-medium text-zinc-500 rounded-full pt-1.5 pr-3 pb-1.5 pl-3">Maison AI</a>
            </div>

            <!-- CTA -->
            <a href="/__LOCALE__/start-project" class="group relative ml-2 inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] transition-transform duration-300 hover:scale-105 shadow-lg shadow-zinc-900/20">
                <span class="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ef4444_0%,#f97316_14.2%,#eab308_28.4%,#22c55e_42.6%,#3b82f6_56.8%,#6366f1_71%,#a855f7_85.2%,#ef4444_100%)]"></span>
                <span class="inline-flex h-full w-full items-center justify-center gap-2 rounded-xl bg-zinc-900/80 px-5 py-2.5 text-xs font-medium text-white backdrop-blur-xl transition-all group-hover:bg-zinc-900/70">
                    Start a Project 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-3 h-3"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </span>
            </a>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="min-h-[90vh] flex flex-col w-full pt-20 pr-6 pl-6 relative items-center justify-center">
        <!-- Subtle Grid Background -->
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10"></div>

        <div class="max-w-4xl w-full text-center space-y-8 relative z-10 reveal active">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-50/50 text-emerald-700 text-[10px] font-medium tracking-wider uppercase">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ROSALT MAISON STUDIOS
            </div>

            <!-- Main Title -->
            <h1 class="md:text-7xl lg:text-8xl leading-[0.95] text-5xl font-medium text-zinc-900 tracking-tight">
                Design. Transform. <br>
                <span class="text-zinc-400">Welcome In.</span>
            </h1>

            <!-- Subtitle -->
            <p class="md:text-xl leading-relaxed text-lg font-light text-zinc-500 max-w-lg mr-auto ml-auto">
                Designing homes, stays, and spaces that sell. Property transformation, styling, and short-term-rental management from one private studio.
            </p>

            <!-- App Store Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 pb-2">
                <!-- iOS -->
                <a href="/__LOCALE__/start-project" class="group flex items-center gap-3 bg-zinc-900 text-white px-5 py-3 rounded-xl hover:bg-zinc-800 hover:-translate-y-0.5 transition-all duration-200 shadow-xl shadow-zinc-900/10 border border-zinc-800">
                    <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.388 15.344c.058 2.652 2.302 3.535 2.406 3.585-.02.062-0.375 1.282-1.234 2.535-0.744 1.084-1.516 2.162-2.73 2.185-1.196.02-1.583-.71-2.955-.71-1.373 0-1.805.69-2.934.735-1.176.046-2.072-1.18-2.825-2.268-1.536-2.215-2.71-6.26-1.134-9.006 0.783-1.36 2.185-2.22 3.708-2.243 1.157-.024 2.25.778 2.955.778 0.705 0 2.03-.96 3.424-.818 0.584.024 2.227.235 3.28 1.776-.083.05-1.96 1.14-1.96 3.448M15.42 5.025c.618-.75 1.035-1.794.92-2.836-0.89.036-1.97.596-2.61 1.343-.574.664-1.076 1.724-0.94 2.74 0.994.077 2.01-.497 2.63-1.247"></path></svg>
                    <div class="flex flex-col items-start leading-none">
                        <span class="text-[10px] text-zinc-400 font-medium">Begin with ROSALT</span>
                        <span class="text-sm font-semibold tracking-wide">Start a Project</span>
                    </div>
                </a>
                <!-- Android -->
                <a href="/__LOCALE__/services" class="group flex items-center gap-3 bg-zinc-900 text-white px-5 py-3 rounded-xl hover:bg-zinc-800 hover:-translate-y-0.5 transition-all duration-200 shadow-xl shadow-zinc-900/10 border border-zinc-800">
                    <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.609 1.814L13.792 12 3.61 22.186a1.14 1.14 0 0 1-1.61-1.01V2.824a1.14 1.14 0 0 1 1.61-1.01zm17.923 8.355l-4.14 2.37-2.686-2.687 2.686-2.686 4.14 2.37c1.32.756 1.32 2.633 0 3.39l-4.14 2.373zm-4.996-3.23l-3.27-3.27 7.032-4.02c.677-.388.756-1.354.142-1.84L14.417 5.75l2.12 1.19zM13.266 12.53l3.27 3.27-2.119 1.189-7.879 4.467c.614-.486.535-1.452-.142-1.84l7.032-4.02-2.162-1.226z"></path></svg>
                    <div class="flex flex-col items-start leading-none">
                        <span class="text-[10px] text-zinc-400 font-medium">Explore the studio</span>
                        <span class="text-sm font-semibold tracking-wide">View Services</span>
                    </div>
                </a>
            </div>

            <!-- Floating Hero Visual (Holo Style) -->
            <div class="mt-12 w-full max-w-5xl aspect-[16/8] relative rounded-3xl overflow-hidden border border-zinc-200/50 shadow-2xl shadow-emerald-900/5 group bg-zinc-100 reveal delay-200 active">
                <img src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&amp;w=2070&amp;auto=format&amp;fit=crop" class="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-1000 ease-in-out">
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                <!-- Interface Elements -->
                <div class="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex flex-col gap-2">
                    <span class="px-2 py-1 bg-white/90 backdrop-blur border border-white/20 rounded text-[10px] text-zinc-900 font-semibold uppercase tracking-widest self-start shadow-sm">ROSALT PROJECT</span>
                    <h3 class="text-2xl md:text-3xl font-medium text-white tracking-tight drop-shadow-sm">The Maison House</h3>
                    <div class="flex items-center gap-4 text-xs text-white/90 font-medium">
                        <span class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="tag" class="lucide lucide-tag w-3 h-3"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle></svg> STR Ready</span>
                        <span class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="bed" class="lucide lucide-bed w-3 h-3"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path></svg> 12 Guests</span>
                        <span class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="maximize" class="lucide lucide-maximize w-3 h-3"><path d="M8 3H5a2 2 0 0 0-2 2v3"></path><path d="M21 8V5a2 2 0 0 0-2-2h-3"></path><path d="M3 16v3a2 2 0 0 0 2 2h3"></path><path d="M16 21h3a2 2 0 0 0 2-2v-3"></path></svg> Full Service</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- How It Works (Timeline Section) -->
    <section class="max-w-6xl mr-auto ml-auto pt-32 pr-6 pb-32 pl-6 relative">
        <div class="mb-24 text-center reveal">
            <h2 class="text-3xl md:text-4xl font-medium tracking-tight text-zinc-900 mb-4">From Vision to Guest-Ready</h2>
            <p class="text-zinc-500 max-w-xl mx-auto">A refined property workflow from the first idea through design, launch, management, and the owner experience.</p>
        </div>

        <div class="relative">
            <!-- Continuous Vertical Line -->
            <div class="absolute left-0 md:left-[50%] top-0 bottom-0 w-[1px] timeline-gradient hidden md:block opacity-30"></div>
            
            <!-- Step 01 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mb-32 relative">
                <!-- Text Content -->
                <div class="relative pl-8 md:pl-0 md:text-right md:pr-12 reveal">
                     <!-- Mobile Line -->
                    <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-emerald-400 md:hidden"></div>
                    
                    <span class="text-5xl font-medium text-emerald-500/20 absolute -top-12 left-8 md:right-12 md:left-auto">01</span>
                    <h3 class="text-2xl font-medium text-zinc-900 mb-3 tracking-tight">Property Onboarding</h3>
                    <p class="text-zinc-500 leading-relaxed text-sm">
                        Owners share the property, photos, goals, budget, timeline, and intended guest experience. ROSALT turns that information into one clear property direction before work begins.
                    </p>
                </div>
                <!-- Visual Content -->
                <div class="relative group reveal-scale delay-200">
                    <div class="absolute -inset-1 bg-gradient-to-r from-emerald-100 to-teal-50 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                    <div class="relative bg-white border border-zinc-100 rounded-2xl p-6 shadow-xl shadow-zinc-200/50">
                        <!-- Abstract Phone UI -->
                        <div class="flex items-center justify-between mb-4 border-b border-zinc-50 pb-4">
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <div class="h-2 w-20 bg-zinc-100 rounded-full"></div>
                            </div>
                            <div class="flex gap-2">
                                <span class="px-2 py-0.5 rounded-md bg-zinc-100 text-[10px] text-zinc-500 font-medium">STR x</span>
                                <span class="px-2 py-0.5 rounded-md bg-zinc-100 text-[10px] text-zinc-500 font-medium">Design + Ops x</span>
                            </div>
                        </div>
                        <div class="aspect-[4/3] bg-zinc-50 rounded-lg mb-4 relative overflow-hidden flex items-center justify-center border border-zinc-100">
                             <img src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&amp;w=800&amp;auto=format&amp;fit=crop" class="opacity-80 w-full h-full object-cover">
                             <div class="absolute bottom-2 left-2 flex gap-1">
                                <div class="bg-black/70 backdrop-blur text-white text-[10px] px-1.5 py-0.5 rounded">OWNER</div>
                                <div class="bg-black/70 backdrop-blur text-white text-[10px] px-1.5 py-0.5 rounded">INTAKE</div>
                             </div>
                        </div>
                        <div class="h-2 w-3/4 bg-zinc-100 rounded-full mb-2"></div>
                        <div class="h-2 w-1/2 bg-zinc-100 rounded-full"></div>
                    </div>
                </div>
            </div>

            <!-- Step 02 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mb-32 relative">
                <!-- Visual Content (Left on Desktop) -->
                <div class="relative group order-2 md:order-1 reveal-scale">
                     <div class="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-violet-50 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                    <div class="relative h-64 w-full max-w-sm mx-auto">
                        <!-- Bottom Card -->
                        <div class="absolute top-4 left-4 right-4 bottom-0 bg-white border border-zinc-100 rounded-2xl shadow-sm transform scale-95 opacity-50"></div>
                        <!-- Middle Card -->
                        <div class="absolute top-2 left-2 right-2 bottom-2 bg-white border border-zinc-100 rounded-2xl shadow-md transform scale-98 opacity-80"></div>
                        <!-- Top Card -->
                        <div class="absolute inset-0 bg-white border border-zinc-100 rounded-2xl shadow-xl p-4 flex flex-col justify-between transform group-hover:rotate-1 transition-transform duration-300">
                            <div class="h-32 bg-zinc-100 rounded-lg overflow-hidden relative">
                                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&amp;w=800&amp;auto=format&amp;fit=crop" class="w-full h-full object-cover">
                            </div>
                            <div class="flex justify-between items-center mt-2 px-4">
                                <button class="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x" class="lucide lucide-x w-4 h-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                </button>
                                <div class="flex flex-col items-center">
                                    <span class="text-xs font-semibold text-zinc-900">West End Retreat</span>
                                    <span class="text-[10px] text-zinc-500">Design Direction</span>
                                </div>
                                <button class="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-emerald-50 hover:text-emerald-500 hover:border-emerald-200 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="heart" class="lucide lucide-heart w-4 h-4"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Text Content -->
                <div class="relative pl-8 md:pl-12 order-1 md:order-2 reveal delay-200">
                    <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-indigo-400 md:hidden"></div>
                    <span class="text-5xl font-medium text-indigo-500/20 absolute -top-12 left-8 md:left-12">02</span>
                    <h3 class="text-2xl font-medium text-zinc-900 mb-3 tracking-tight">Design Direction & Approvals</h3>
                    <p class="text-zinc-500 leading-relaxed text-sm">
                        Mood boards, selections, notes, contractor-ready scopes, and project files live together. Owners can review decisions and approve the direction without losing the details in texts or email.
                    </p>
                </div>
            </div>

            <!-- Step 03 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mb-32 relative">
                <!-- Text Content -->
                <div class="relative pl-8 md:pl-0 md:text-right md:pr-12 reveal">
                    <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-violet-400 md:hidden"></div>
                    <span class="text-5xl font-medium text-violet-500/20 absolute -top-12 left-8 md:right-12 md:left-auto">03</span>
                    <h3 class="text-2xl font-medium text-zinc-900 mb-3 tracking-tight">Guest Experience</h3>
                    <p class="text-zinc-500 leading-relaxed text-sm">
                        ROSALT looks beyond how a property photographs. Arrival, comfort, amenities, layout, stocking, and stay details are refined so the finished space works as beautifully as it looks.
                    </p>
                </div>
                <!-- Visual Content -->
                <div class="relative group reveal-scale delay-200">
                    <div class="absolute -inset-1 bg-gradient-to-r from-violet-100 to-fuchsia-50 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                    <div class="relative bg-white border border-zinc-100 rounded-2xl p-6 shadow-xl shadow-zinc-200/50 flex flex-col gap-4">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-medium text-zinc-500 uppercase tracking-wider">ACTIVE PROPERTY</span>
                            <div class="relative w-10 h-6 bg-violet-500 rounded-full transition-colors cursor-pointer">
                                <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                        <div class="flex items-center gap-4 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="baby" class="lucide lucide-baby w-5 h-5"><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path><path d="M15 12h.01"></path><path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path><path d="M9 12h.01"></path></svg>
                            </div>
                            <div>
                                <h4 class="text-sm font-semibold text-zinc-900">Guest-Ready Plan</h4>
                                <p class="text-[10px] text-zinc-500">Styling, amenities &amp; stay details</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-2">
                             <div class="h-16 rounded-lg bg-zinc-100 overflow-hidden relative group-hover:scale-105 transition-transform"><img src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&amp;fit=crop&amp;q=80&amp;w=200" class="object-cover w-full h-full"></div>
                             <div class="h-16 rounded-lg bg-zinc-100 overflow-hidden relative group-hover:scale-105 transition-transform delay-75"><img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&amp;fit=crop&amp;q=80&amp;w=200" class="object-cover w-full h-full"></div>
                             <div class="h-16 rounded-lg bg-zinc-100 overflow-hidden relative group-hover:scale-105 transition-transform delay-150"><img src="https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&amp;fit=crop&amp;q=80&amp;w=200" class="object-cover w-full h-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 04 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative items-center">
                 <!-- Visual Content (Left on Desktop) -->
                 <div class="group order-2 md:order-1 relative reveal-scale">
                    <div class="absolute -inset-1 bg-gradient-to-r from-orange-100 to-amber-50 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                    <div class="overflow-hidden shadow-zinc-900/10 bg-zinc-900 h-64 rounded-2xl pt-1 pr-1 pb-1 pl-1 relative shadow-xl">
                         <!-- Map Pattern -->
                        <div class="overflow-hidden flex bg-[#1c1c1c] w-full h-full rounded-xl relative items-center justify-center">
                             <!-- Grid Lines -->
                             <div class="overflow-hidden w-full h-full absolute top-0 right-0 bottom-0 left-0">
    <!-- Map Texture Background -->
    <div class="absolute inset-0 opacity-30 mix-blend-screen">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&amp;w=1000&amp;auto=format&amp;fit=crop" class="w-full h-full object-cover grayscale contrast-125 scale-110" alt="Map of Spain Coast">
    </div>
    
    <!-- Gradient Overlay for Depth -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#1c1c1c]/80 via-transparent to-[#1c1c1c]/90"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#1c1c1c_100%)]"></div>

    <!-- Decorative Map Elements -->
    <div class="overflow-hidden bg-sky-50 rounded-xl absolute top-0 right-0 bottom-0 left-0">
    <!-- Map Grid Pattern -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-xl">
    <!-- Darkening base for contrast -->
    <div class="absolute inset-0 bg-zinc-900/20 mix-blend-multiply"></div>
    
    <!-- Holographic Grid Pattern -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-70"></div>

    <!-- Rotating Radar Sweep -->
    <div class="absolute inset-[-50%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_300deg,rgba(16,185,129,0.1)_360deg)] animate-[spin_5s_linear_infinite]"></div>

    <!-- Central Tactical Reticle -->
    <div class="absolute inset-0 flex items-center justify-center opacity-40">
        <div class="w-[70%] h-[70%] border border-emerald-500/20 rounded-full animate-pulse"></div>
        <div class="w-[50%] h-[50%] border border-dashed border-emerald-500/20 rounded-full"></div>
        <div class="w-[30%] h-[30%] border border-emerald-500/20 rounded-full"></div>
        <!-- Crosshairs -->
        <div class="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        <div class="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"></div>
    </div>
    
    <!-- HUD Corner Elements -->
    <div class="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-sm"></div>
    <div class="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-sm"></div>
    <div class="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-500/30 rounded-bl-sm"></div>
    <div class="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-500/30 rounded-br-sm"></div>
    
    <!-- Active Status Indicator -->
    <div class="absolute top-4 right-8 flex items-center gap-2">
        <div class="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></div>
        <span class="text-[8px] font-mono font-bold text-emerald-500/80 tracking-widest uppercase">OPS ACTIVE</span>
    </div>
</div>
    
    <!-- Spain & Active Stays Silhouette (Light Mode) -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm" viewBox="0 0 400 200" preserveAspectRatio="none">
        <!-- Iberian Peninsula (Abstract) -->
        <path d="M -20 -20 L 280 -20 L 260 80 Q 240 140 140 150 Q 80 155 40 180 L -20 180 Z" fill="white" stroke="#e2e8f0" stroke-width="2"></path>
        
        <!-- Balearic Active Stays -->
        <g fill="white" stroke="#e2e8f0" stroke-width="2">
            <!-- Mallorca -->
            <path d="M 310 80 Q 330 70 340 90 Q 330 110 310 100 Z"></path>
            <!-- Murfreesboro -->
            <circle cx="290" cy="120" r="8"></circle>
            <!-- Menorca -->
            <circle cx="360" cy="75" r="6"></circle>
        </g>
    </svg>

    <!-- Connection Line (Dotted) -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200">
        <path d="M 140 150 Q 215 160 290 120" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 4" class="opacity-50"></path>
    </svg>

    <!-- Nashville Marker -->
    <div class="absolute top-[75%] left-[35%] group cursor-default">
        <div class="relative flex items-center justify-center">
            <div class="w-3 h-3 bg-orange-500 rounded-full shadow-[0_2px_8px_rgba(249,115,22,0.4)] ring-2 ring-white relative z-10 group-hover:scale-110 transition-transform duration-300"></div>
            <div class="absolute w-8 h-8 bg-orange-500/10 rounded-full animate-pulse"></div>
        </div>
        <div class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-100 transition-all group-hover:-translate-y-1">
            <div class="px-2.5 py-1 bg-white rounded-lg shadow-lg shadow-zinc-200/50 border border-zinc-100 text-[10px] font-semibold text-zinc-700 whitespace-nowrap tracking-tight">
                Nashville
            </div>
            <div class="w-2 h-2 bg-white rotate-45 -mt-1 border-r border-b border-zinc-100"></div>
        </div>
    </div>

    <!-- Murfreesboro Marker -->
    <div class="absolute top-[60%] left-[72.5%] group cursor-default">
        <div class="relative flex items-center justify-center">
            <div class="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_2px_8px_rgba(16,185,129,0.4)] ring-2 ring-white relative z-10 group-hover:scale-110 transition-transform duration-300"></div>
            <div class="absolute w-8 h-8 bg-emerald-500/10 rounded-full"></div>
        </div>
        <div class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-100 transition-all group-hover:-translate-y-1">
            <div class="px-2.5 py-1 bg-white rounded-lg shadow-lg shadow-zinc-200/50 border border-zinc-100 text-[10px] font-semibold text-zinc-700 whitespace-nowrap tracking-tight">
                Murfreesboro
            </div>
            <div class="w-2 h-2 bg-white rotate-45 -mt-1 border-r border-b border-zinc-100"></div>
        </div>
    </div>
    
    <!-- Legend / Scale -->
    <div class="absolute bottom-3 left-3 flex gap-3">
        <div class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/80 backdrop-blur-sm border border-zinc-200/50 shadow-sm">
            <div class="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
            <span class="text-[9px] font-medium text-zinc-500 uppercase tracking-wider">Portfolio</span>
        </div>
        <div class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/80 backdrop-blur-sm border border-zinc-200/50 shadow-sm">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span class="text-[9px] font-medium text-zinc-500 uppercase tracking-wider">Active Stays</span>
        </div>
    </div>
</div>
</div>
                             
                             <!-- Pin -->
                             <div class="relative z-10 flex flex-col items-center animate-bounce">
                                 <div class="bg-orange-500 text-white p-2 rounded-full shadow-lg shadow-orange-500/30">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="help-circle" class="lucide lucide-help-circle w-5 h-5"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
                                 </div>
                                 <div class="w-2 h-2 bg-orange-500 rounded-full mt-1"></div>
                             </div>

                             <!-- UI Overlay -->
                             <div class="flex gap-2 bg-white/10 border-white/10 border rounded-full pt-1 pr-3 pb-1 pl-3 absolute top-4 right-4 backdrop-blur gap-x-2 gap-y-2 items-center">
                                <span class="text-[10px] text-zinc-400 font-mono">STATUS</span>
                                <span class="text-xs text-white font-mono font-bold">LIVE</span>
                             </div>

                             <div class="bg-zinc-800/90 border-white/5 border rounded-lg pt-3 pr-3 pb-3 pl-3 absolute right-4 bottom-4 left-4 backdrop-blur">
                                 <p class="text-[10px] text-zinc-400 mb-2 uppercase tracking-wider">Todayâ€™s operations</p>
                                 <div class="flex gap-2">
                                     <button class="flex-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[10px] py-1.5 rounded transition-colors">Arrivals</button>
                                     <button class="flex-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[10px] py-1.5 rounded transition-colors">Murfreesboro</button>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
                <!-- Text Content -->
                <div class="relative pl-8 md:pl-12 order-1 md:order-2 reveal delay-200">
                    <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-orange-400 md:hidden"></div>
                    <span class="text-5xl font-medium text-orange-500/20 absolute -top-12 left-8 md:left-12">04</span>
                    <h3 class="text-2xl font-medium text-zinc-900 mb-3 tracking-tight">Property Management</h3>
                    <p class="text-zinc-500 leading-relaxed text-sm">
                        ROSALT manages the operating layer behind the stay: reservations, turnovers, cleaning, maintenance, inventory, owner communication, and the details that protect the guest experience.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Data Section -->
    <section class="py-24 border-t border-zinc-100 bg-zinc-50/50">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            <div class="space-y-8 reveal">
                <h2 class="text-3xl md:text-5xl font-medium tracking-tight text-zinc-900 leading-[1.1]">
                    Owner Visibility <br>
                    <span class="text-zinc-400">Without the Noise.</span>
                </h2>
                <div class="space-y-6">
                    <div class="flex gap-4 items-start group">
                        <div class="p-2 rounded-lg bg-white border border-zinc-200 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="scan-face" class="lucide lucide-scan-face w-5 h-5 text-zinc-400 group-hover:text-emerald-600"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><path d="M9 9h.01"></path><path d="M15 9h.01"></path></svg>
                        </div>
                        <div>
                            <h4 class="text-zinc-900 font-medium mb-1 text-sm">Owner Reporting</h4>
                            <p class="text-xs text-zinc-500">Upcoming stays, property status, maintenance, documents, and performance in one place.</p>
                        </div>
                    </div>
                    <div class="flex gap-4 items-start group">
                        <div class="p-2 rounded-lg bg-white border border-zinc-200 group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="glasses" class="lucide lucide-glasses w-5 h-5 text-zinc-400 group-hover:text-indigo-600"><circle cx="6" cy="15" r="4"></circle><circle cx="18" cy="15" r="4"></circle><path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2"></path><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"></path><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"></path></svg>
                        </div>
                        <div>
                            <h4 class="text-zinc-900 font-medium mb-1 text-sm">Maison AI Portal</h4>
                            <p class="text-xs text-zinc-500">A private workspace connecting ROSALT, owners, cleaners, vendors, projects, and property operations.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Decorative Graph -->
            <div class="relative h-[300px] w-full bg-white rounded-3xl border border-zinc-200/50 shadow-xl shadow-zinc-200/20 p-6 flex flex-col justify-between overflow-hidden reveal-scale delay-200">
                <div class="flex justify-between items-center relative z-10">
                    <span class="text-[10px] font-mono text-emerald-600 font-semibold tracking-wider">LIVE PROPERTY DATA</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="activity" class="lucide lucide-activity w-4 h-4 text-emerald-500 animate-pulse"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>
                </div>
                <div class="space-y-4 relative z-10">
                    <!-- Graph Bars -->
                    <div class="flex items-end gap-2 h-32 justify-between px-2">
                        <div class="w-full bg-zinc-100 hover:bg-emerald-500/80 transition-all rounded-t-sm h-[40%]"></div>
                        <div class="w-full bg-zinc-100 hover:bg-emerald-500/80 transition-all rounded-t-sm h-[70%]"></div>
                        <div class="w-full bg-zinc-100 hover:bg-emerald-500/80 transition-all rounded-t-sm h-[50%]"></div>
                        <div class="w-full bg-zinc-100 hover:bg-emerald-500/80 transition-all rounded-t-sm h-[85%]"></div>
                        <div class="w-full bg-emerald-500 hover:bg-emerald-600 transition-all rounded-t-sm h-[60%] shadow-lg shadow-emerald-500/20 relative group">
                            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                +12%
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between text-[10px] text-zinc-400 font-mono uppercase">
                        <span>Q1</span>
                        <span>Q2</span>
                        <span>Q3</span>
                        <span>Q4</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-zinc-200 bg-white pt-20 pb-12 px-6">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div class="space-y-4">
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="palmtree" class="lucide lucide-palmtree w-5 h-5 text-emerald-600 stroke-[1.5]"><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"></path><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3"></path><path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35"></path><path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14"></path></svg>
                    <span class="text-lg font-semibold text-zinc-900 tracking-tight">ROSALT.</span>
                </div>
                <p class="text-zinc-500 text-xs max-w-xs leading-relaxed">
                    Designing homes, stays, and spaces that sell through thoughtful design, hospitality, and property management.
                </p>
            </div>
            
            <div class="flex gap-16">
                <div class="flex flex-col gap-3">
                    <span class="text-[10px] font-semibold text-zinc-900 uppercase tracking-wider">Platform</span>
                    <a href="/__LOCALE__/services" class="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Services</a>
                    <a href="/__LOCALE__/property-management" class="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Management</a>
                    <a href="/__LOCALE__/maison-ai" class="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Maison AI</a>
                </div>
                <div class="flex flex-col gap-3">
                    <span class="text-[10px] font-semibold text-zinc-900 uppercase tracking-wider">Company</span>
                    <a href="/__LOCALE__/about" class="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">About</a>
                    <a href="/__LOCALE__/portfolio" class="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Portfolio</a>
                    <a href="/__LOCALE__/start-project" class="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Start a Project</a>
                </div>
            </div>
        </div>
        <div class="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-400">
            <span>Â© 2026 ROSALT Maison Studios. All rights reserved.</span>
            <div class="flex gap-4">
                <a href="#" class="hover:text-zinc-800">Privacy Policy</a>
                <a href="#" class="hover:text-zinc-800">Terms of Service</a>
            </div>
        </div>
    </footer>

    <!-- Mobile Floating Dock -->
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
         <div class="flex items-center gap-8 px-6 py-3 bg-white/90 backdrop-blur-xl border border-zinc-200/50 rounded-full shadow-2xl shadow-zinc-900/10">
         </div>
    </div>`;

const masterStyles = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
body {
font-family: 'Inter', sans-serif;
background-color: #ffffff;
color: #18181b;
}
/* Hide scrollbar for clean UI */
.no-scrollbar::-webkit-scrollbar {
display: none;
}
.no-scrollbar {
-ms-overflow-style: none;
scrollbar-width: none;
}
/* Custom gradient text utility */
.text-gradient {
background: linear-gradient(to bottom right, #09090b, #52525b);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
}
/* Timeline Gradient Line */
.timeline-gradient {
background: linear-gradient(to bottom, #10b981, #6366f1, #f97316);
}
/* Scroll Animations */
.reveal {
opacity: 0;
transform: translateY(30px);
transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
will-change: transform, opacity;
}
.reveal.active {
opacity: 1;
transform: translateY(0);
}
.reveal-scale {
opacity: 0;
transform: scale(0.95) translateY(20px);
transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-scale.active {
opacity: 1;
transform: scale(1) translateY(0);
}
/* Stagger delays */
.delay-100 { transition-delay: 100ms; }
.delay-200 { transition-delay: 200ms; }
.delay-300 { transition-delay: 300ms; }`;

export function RosaltHome({ locale }: { locale: string }) {
  useEffect(() => {
    document.title = "ROSALT Maison Studios";

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".reveal, .reveal-scale").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const markup = masterMarkup.replaceAll("__LOCALE__", locale);

  return (
    <>
            <style dangerouslySetInnerHTML={{ __html: masterStyles }} />
      <div
        className="antialiased selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </>
  );
}


