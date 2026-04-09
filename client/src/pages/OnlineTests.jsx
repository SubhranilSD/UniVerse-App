import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldAlert, Flag, Save, ChevronRight, ChevronLeft, Map, Target, CheckCircle2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const subjects = [
    {
        key: 'marks_maths',
        label: 'Mathematics',
        icon: 'fa-calculator',
        color: '#6366f1',
        description: 'Calculus · Algebra · Statistics · Linear Algebra',
        questions: [
            { q:"What is ∫ x² dx?", options:["x³/3 + C","2x + C","x² + C","3x³ + C"], correct:0 },
            { q:"If |A|=5 for a 3x3 matrix, what is |2A|?", options:["10","40","80","20"], correct:2 },
            { q:"lim(x→0) (sin x)/x = ?", options:["0","∞","Undefined","1"], correct:3 },
            { q:"What is the derivative of e^x?", options:["xe^(x-1)","e^x","1/e^x","e"], correct:1 },
            { q:"Solve: 2x + 5 = 15", options:["x=4","x=5","x=10","x=6"], correct:1 },
            { q:"What is the rank of a 3×3 zero matrix?", options:["1","3","0","2"], correct:2 },
            { q:"∫₀^π sin(x) dx = ?", options:["0","2","-2","π"], correct:1 },
            { q:"The eigenvalues of a diagonal matrix are its:", options:["Off-diagonal entries","Diagonal entries","Determinant","Trace"], correct:1 },
            { q:"A permutation of n objects has how many arrangements?", options:["n","n!","2^n","n²"], correct:1 },
            { q:"What is the sum of the infinite GP 1 + 1/2 + 1/4 + ...?", options:["∞","2","1.5","3"], correct:1 },
            { q:"What is the value of nC0?", options:["n","0","n!","1"], correct:3 },
            { q:"The derivative of sin(x) is:", options:["cos(x)","-cos(x)","tan(x)","-sin(x)"], correct:0 },
            { q:"The inverse of a 2×2 matrix [[a,b],[c,d]] involves dividing by:", options:["a+d","a-d","ad-bc","ab-cd"], correct:2 },
            { q:"What is 0! equal to?", options:["0","Undefined","1","∞"], correct:2 },
            { q:"Mean of {2,4,6,8,10} = ?", options:["5","6","4","7"], correct:1 },
            { q:"Variance of a constant random variable is:", options:["1","Undefined","∞","0"], correct:3 },
            { q:"What is the dot product of (1,0) and (0,1)?", options:["1","0","-1","√2"], correct:1 },
            { q:"What does the Fundamental Theorem of Calculus connect?", options:["Derivatives and integrals","Limits and continuity","Series and sequences","Matrices and vectors"], correct:0 },
            { q:"Which of these is NOT a prime number?", options:["7","11","1","13"], correct:2 },
            { q:"The Laplace transform of e^(at) is:", options:["1/(s-a)","a/s","1/s","s/(s-a)"], correct:0 },
            { q:"What is lim(x→∞) 1/x?", options:["1","∞","0","-1"], correct:2 },
            { q:"The area of a circle with radius r is:", options:["2πr","πr²","4πr²","πr"], correct:1 },
            { q:"det(AB) = ?", options:["det(A)+det(B)","det(A)×det(B)","det(A)/det(B)","det(A)-det(B)"], correct:1 },
            { q:"What is i² (where i is imaginary unit)?", options:["1","-1","i","-i"], correct:1 },
            { q:"Binomial theorem expansion of (x+y)^n has how many terms?", options:["n","n-1","n+1","2n"], correct:2 },
            { q:"Which rule is: d(uv)/dx = u'v + uv'?", options:["Chain rule","Product rule","Power rule","Quotient rule"], correct:1 },
            { q:"The Fourier series represents functions as:", options:["Polynomials","Sums of sines and cosines","Matrix decompositions","Taylor series"], correct:1 },
            { q:"A matrix A where A = Aᵀ is called:", options:["Singular","Symmetric","Skew-symmetric","Identity"], correct:1 },
            { q:"The median of {3,1,4,1,5,9,2,6} sorted is:", options:["3.5","4","3","4.5"], correct:0 },
            { q:"What is log₂(8)?", options:["2","3","4","8"], correct:1 },
            { q:"The number of diagonals in a hexagon is:", options:["6","9","12","15"], correct:1 },
            { q:"sin²θ + cos²θ = ?", options:["0","2","1","sinθcosθ"], correct:2 },
            { q:"What is the nth term of arithmetic sequence a, a+d, a+2d,...?", options:["a+nd","a+(n-1)d","a+2nd","nd"], correct:1 },
            { q:"Standard deviation is the _____ root of variance.", options:["Cube","Fourth","Square","Fifth"], correct:2 },
            { q:"What is the cofactor expansion used for?", options:["Matrix multiplication","Eigenvalues","Determinant calculation","Inverse"], correct:2 },
            { q:"If P(A) = 0.3 and P(B) = 0.5 (independent), P(A∩B) = ?", options:["0.8","0.15","0.2","0.35"], correct:1 },
            { q:"Taylor series of f(x) around x=a uses:", options:["Derivatives of f at a","Integrals of f at a","Values of f at origin","Laplace transforms"], correct:0 },
            { q:"The cross product of parallel vectors is:", options:["1","Undefined","A scalar","-1"], correct:2 },
            { q:"Gauss-Jordan elimination is used to:", options:["Find eigenvalues","Solve linear equations","Compute integrals","Calculate determinants"], correct:1 },
            { q:"Which trig identity: 1 + tan²θ = ?", options:["sin²θ","sec²θ","cosec²θ","cos²θ"], correct:1 },
            { q:"If f(x) = x³, then f'(x) = ?", options:["3x","x²","3x²","x³/3"], correct:2 },
            { q:"The modulus of complex number a+bi is:", options:["a+b","a²+b²","√(a²+b²)","a-b"], correct:2 },
            { q:"Normal distribution is also called:", options:["Poisson distribution","Gaussian distribution","Bernoulli distribution","Uniform distribution"], correct:1 },
            { q:"Which of these is a non-singular matrix?", options:["[[0,0],[0,0]]","[[1,0],[0,1]]","[[0,1],[0,0]]","[[2,4],[1,2]]"], correct:1 },
            { q:"Curl of a gradient field equals:", options:["Divergence","Zero vector","Nonzero scalar","Gradient again"], correct:1 },
            { q:"The dual of a maximisation LP problem is a:", options:["Maximisation problem","Feasibility problem","Minimisation problem","Same problem"], correct:2 },
            { q:"Probability of getting 2 heads in 4 tosses = ?", options:["1/4","3/8","1/2","1/8"], correct:1 },
            { q:"What is ∫ e^x dx?", options:["xe^x","e^(x+1)","e^x + C","e^(x-1)"], correct:2 },
            { q:"The product of a matrix and its inverse is:", options:["Zero matrix","Itself","Identity matrix","Transpose"], correct:2 },
            { q:"An improper integral converges if:", options:["It is infinite","Its limit exists and is finite","It is zero","It oscillates"], correct:1 },
        ]
    },
    {
        key: 'marks_ds',
        label: 'Data Structures',
        icon: 'fa-code',
        color: '#06b6d4',
        description: 'Arrays · Trees · Graphs · Sorting · Complexity',
        questions: [
            { q:"Search time in a balanced BST?", options:["O(n)","O(log n)","O(1)","O(n log n)"], correct:1 },
            { q:"Which follows LIFO?", options:["Queue","Linked List","Stack","Tree"], correct:2 },
            { q:"Worst-case QuickSort time complexity?", options:["O(n log n)","O(n)","O(n²)","O(log n)"], correct:2 },
            { q:"A queue follows which principle?", options:["LIFO","FILO","FIFO","LILO"], correct:2 },
            { q:"In a min-heap, which element is at the root?", options:["Maximum","Median","Random","Minimum"], correct:3 },
            { q:"Binary search requires data to be:", options:["Unsorted","Random","Sorted","Hashed"], correct:2 },
            { q:"A graph with no cycles is called:", options:["Multigraph","Complete graph","Tree","Dense graph"], correct:2 },
            { q:"Which traversal visits root first?", options:["Inorder","Postorder","Preorder","Level-order"], correct:2 },
            { q:"Linked list insertion at head is:", options:["O(n)","O(log n)","O(1)","O(n²)"], correct:2 },
            { q:"Dijkstra's algorithm solves:", options:["MST","Shortest path","Graph coloring","Topological sort"], correct:1 },
            { q:"AVL tree maintains:", options:["Max degree","Min height","Balance factor ≤ 1","Sorted leaves"], correct:2 },
            { q:"A hash collision occurs when:", options:["Hash function overflows","Two keys map to the same slot","Memory is full","Table is empty"], correct:1 },
            { q:"Which sort is stable?", options:["Heap Sort","Quick Sort","Selection Sort","Merge Sort"], correct:3 },
            { q:"Space complexity of DFS on a graph with V vertices?", options:["O(1)","O(V)","O(V²)","O(E)"], correct:1 },
            { q:"A deque (double-ended queue) allows insertion from:", options:["Front only","Back only","Both ends","Middle only"], correct:2 },
            { q:"Inorder traversal of a BST gives:", options:["Preorder result","Reverse sorted","Sorted order","BFS order"], correct:2 },
            { q:"The number of edges in a complete graph with n nodes?", options:["n","n-1","n(n-1)/2","n²"], correct:2 },
            { q:"Prim's algorithm is used for:", options:["Shortest path","Minimum spanning tree","Topological sort","Hashing"], correct:1 },
            { q:"Which data structure is best for implementing LRU cache?", options:["Array","Stack","Hashmap + Doubly Linked List","Priority Queue"], correct:2 },
            { q:"B-trees are mainly used in:", options:["In-memory sort","Databases and file systems","Networking","Recursion"], correct:1 },
            { q:"What is the height of a complete binary tree with n nodes?", options:["n","n/2","⌊log₂n⌋","2n"], correct:2 },
            { q:"Which algorithm uses divide and conquer?", options:["Bubble Sort","Insertion Sort","Merge Sort","Selection Sort"], correct:2 },
            { q:"In graph, indegree of a node is:", options:["Edges leaving it","Edges entering it","Total edges","Adjacent edges"], correct:1 },
            { q:"Floyd-Warshall finds:", options:["Single source shortest path","All-pairs shortest path","BFS tree","DFS tree"], correct:1 },
            { q:"Red-Black tree guarantees height is:", options:["O(1)","O(n)","O(log n)","O(n²)"], correct:2 },
            { q:"Stack overflow most commonly occurs due to:", options:["Heap allocation","Infinite recursion","Array access","File I/O"], correct:1 },
            { q:"Kruskal's algorithm requires edges sorted by:", options:["Vertex degree","Edge weight","Color","Direction"], correct:1 },
            { q:"Which is NOT an O(n log n) sort?", options:["Merge Sort","Heap Sort","Quick Sort avg","Bubble Sort"], correct:3 },
            { q:"Trie is most efficient for:", options:["Numeric sorting","String prefix search","Graph traversal","Matrix ops"], correct:1 },
            { q:"A sparse matrix is best stored as:", options:["2D Array","Dense matrix","Compressed row/col format","Linked list of rows"], correct:2 },
            { q:"Topological sort is possible only on:", options:["Directed Acyclic Graph","Undirected Graph","Complete Graph","Cyclic Graph"], correct:0 },
            { q:"In BFS, which data structure is used?", options:["Stack","Queue","Deque","Priority Queue"], correct:1 },
            { q:"Amortised time complexity of dynamic array push?", options:["O(n)","O(log n)","O(1)","O(n²)"], correct:2 },
            { q:"What does DSU (Disjoint Set Union) support efficiently?", options:["Sorting","Merge and Find operations","Graph coloring","Tree traversal"], correct:1 },
            { q:"A balanced binary tree with n nodes has depth:", options:["n","n/2","O(log n)","O(n²)"], correct:2 },
            { q:"Which algorithm detects negative cycles?", options:["Dijkstra's","Prim's","Bellman-Ford","DFS"], correct:2 },
            { q:"Post-fix notation evaluates using:", options:["Queue","Stack","Tree","Array"], correct:1 },
            { q:"Open addressing is a technique used in:", options:["Trees","Hashing","Graphs","Sorting"], correct:1 },
            { q:"Which traversal is used for garbage collection?", options:["Preorder","Postorder","Inorder","BFS"], correct:1 },
            { q:"The maximum number of nodes at level d of a binary tree?", options:["2d","d²","2^d","d"], correct:2 },
            { q:"A segment tree answers range queries in:", options:["O(n)","O(log n)","O(1)","O(n log n)"], correct:1 },
            { q:"A priority queue is implemented most efficiently using:", options:["Array","Sorted List","Heap","Linked List"], correct:2 },
            { q:"Which of these is a linear data structure?", options:["Tree","Graph","Heap","Array"], correct:3 },
            { q:"What operation removes duplicates in O(n log n)?", options:["Hashing","Sorting + Linear scan","Nested loops","Recursion"], correct:1 },
            { q:"A circular linked list has:", options:["No head","Head pointing to null","Last node pointing to head","No nodes"], correct:2 },
            { q:"When does a hash table degrade to O(n)?", options:["When empty","When load factor is 0","When all keys collide","When sorted"], correct:2 },
            { q:"In a doubly linked list, deletion of a node is:", options:["O(n)","O(1) if pointer given","O(log n)","O(n²)"], correct:1 },
            { q:"Fenwick/BIT tree supports prefix sum queries in:", options:["O(n)","O(1)","O(log n)","O(n log n)"], correct:2 },
            { q:"Which graph representation is efficient for dense graphs?", options:["Adjacency list","Edge list","Adjacency matrix","Incidence matrix"], correct:2 },
            { q:"Depth-First Search uses how many colors in graph coloring proofs?", options:["1","2","3","4"], correct:1 },
            { q:"What is the time to build a heap from n elements?", options:["O(n log n)","O(n²)","O(n)","O(log n)"], correct:2 },
        ]
    },
    {
        key: 'marks_os',
        label: 'Operating Systems',
        icon: 'fa-microchip',
        color: '#f59e0b',
        description: 'Scheduling · Memory · Deadlocks · File Systems',
        questions: [
            { q:"A deadlock occurs when processes ?", options:["Crash","Wait for each other indefinitely","Speed up","Share resources freely"], correct:1 },
            { q:"Which is NOT a process state?", options:["Running","Waiting","Sleeping","Ready"], correct:2 },
            { q:"LRU stands for?", options:["Least Recently Used","Last Random Unit","Low Rate Utility","Long Range Unit"], correct:0 },
            { q:"What is thrashing?", options:["Fast IO","Excessive paging reducing CPU utility","Out of memory crash","Disk failure"], correct:1 },
            { q:"Round Robin scheduling uses:", options:["Priority","Fixed time quantum","FIFO","Shortest job"], correct:1 },
            { q:"A semaphore is used for:", options:["Memory allocation","Process synchronization","File management","CPU scheduling"], correct:1 },
            { q:"FCFS scheduling is:", options:["Preemptive","Non-preemptive","Priority based","Round-robin"], correct:1 },
            { q:"Which page replacement has Belady's anomaly?", options:["LRU","Optimal","FIFO","LFU"], correct:2 },
            { q:"A critical section solves:", options:["Deadlock","Race conditions","Page faults","Starvation"], correct:1 },
            { q:"The PCB stores:", options:["File contents","Process state and registers","Memory pages","Disk blocks"], correct:1 },
            { q:"Virtual memory allows:", options:["More CPUs","Processes to exceed physical RAM","Faster disk I/O","Multiple OSes"], correct:1 },
            { q:"A mutex provides:", options:["Multi-thread access","Exclusive access to a resource","CPU scheduling","Memory mapping"], correct:1 },
            { q:"What is context switching?", options:["Changing process priority","Saving and restoring process state","Moving process to disk","Allocating new memory"], correct:1 },
            { q:"Paging eliminates which problem?", options:["Thrashing","Internal fragmentation","External fragmentation","Starvation"], correct:2 },
            { q:"Peterson's solution solves:", options:["Deadlock","Mutual exclusion for 2 processes","Scheduling","Memory allocation"], correct:1 },
            { q:"The kernel runs in:", options:["User mode","Supervisor/kernel mode","Virtual mode","Hibernation mode"], correct:1 },
            { q:"Which is a preemptive scheduling algorithm?", options:["FCFS","SJF non-preemptive","SRTF","Priority non-preemptive"], correct:2 },
            { q:"Banker's algorithm prevents:", options:["Page faults","Starvation","Deadlock","Thrashing"], correct:2 },
            { q:"A thread shares ___ with other threads in the same process.", options:["Stack","Program counter","Code and data","Registers"], correct:2 },
            { q:"What does fork() do in Unix?", options:["Execute a command","Creates a child process","Kill a process","Load a module"], correct:1 },
            { q:"Demand paging loads pages:", options:["At startup","When needed","Periodically","Never"], correct:1 },
            { q:"The Translation Lookaside Buffer (TLB) is a cache for:", options:["Disk blocks","Page table entries","Register values","Interrupt handlers"], correct:1 },
            { q:"Segmentation provides:", options:["Fixed-size memory blocks","Logical division of memory","Physical addressing","Kernel-only memory"], correct:1 },
            { q:"An inode in Unix file systems stores:", options:["File name","File data","File metadata","Directory listing"], correct:2 },
            { q:"Shortest Job First (SJF) minimises:", options:["Turnaround time","Context switches","Page faults","Waiting time"], correct:0 },
            { q:"The boot process loads the OS into:", options:["Cache","Disk","RAM","ROM"], correct:2 },
            { q:"Which condition is NOT required for deadlock?", options:["Mutual exclusion","Hold and wait","No preemption","Starvation"], correct:3 },
            { q:"A shell is an example of:", options:["Kernel module","System call","User-space process","Device driver"], correct:2 },
            { q:"The working set model is used to manage:", options:["CPU scheduling","Disk I/O","Thrashing","Process creation"], correct:2 },
            { q:"DMA (Direct Memory Access) allows:", options:["CPU to bypass cache","Devices to access memory without CPU","Faster CPU execution","Virtual memory only"], correct:1 },
            { q:"A process becomes a zombie when:", options:["It is running","It finishes but parent hasn't read exit status","It is swapped out","It is blocked"], correct:1 },
            { q:"The clock algorithm is a variation of:", options:["LRU","FIFO","Optimal","MFU"], correct:0 },
            { q:"Which is the first process to run in Unix?", options:["Shell","init (PID 1)","Kernel","Scheduler"], correct:1 },
            { q:"Spooling is used for:", options:["CPU scheduling","Managing slow I/O devices","Virtual memory","Page replacement"], correct:1 },
            { q:"An interrupt-driven I/O reduces:", options:["Memory usage","CPU busy-waiting","Disk access time","File fragmentation"], correct:1 },
            { q:"Process synchronization is needed to avoid:", options:["Cache misses","Race conditions","Page faults","Disk failures"], correct:1 },
            { q:"The exec() system call:", options:["Creates a child","Replaces process image with new program","Terminates a process","Waits for a child"], correct:1 },
            { q:"RAID is primarily used for:", options:["Process scheduling","Disk redundancy/performance","Virtual memory","Thread management"], correct:1 },
            { q:"Which memory allocation causes external fragmentation?", options:["Paging","Segmentation","Slab allocation","Buddy system"], correct:1 },
            { q:"A monitor in OS is a:", options:["Hardware device","High-level sync construct","Type of scheduler","Disk partition"], correct:1 },
            { q:"The purpose of the file system is to:", options:["Schedule CPUs","Manage disk storage","Allocate RAM","Handle interrupts"], correct:1 },
            { q:"Buffering in I/O helps to:", options:["Reduce memory usage","Match speed difference between devices","Eliminate drivers","Increase latency"], correct:1 },
            { q:"A spin-lock wastes:", options:["Memory","CPU cycles busy-waiting","Disk I/O","Network bandwidth"], correct:1 },
            { q:"Which signal terminates a process in Unix?", options:["SIGINT","SIGKILL","SIGHUP","SIGPIPE"], correct:1 },
            { q:"The page table maps:", options:["Virtual to physical addresses","Files to disk blocks","Processes to CPUs","Registers to memory"], correct:0 },
            { q:"Kernel threads vs user threads: kernel threads are scheduled by:", options:["The user application","The OS kernel","The library","Another user thread"], correct:1 },
            { q:"Pre-fetching in memory management:", options:["Loads pages before they are needed","Removes pages frequently","Locks pages in RAM","Reduces page table size"], correct:0 },
            { q:"What is the purpose of the MMU?", options:["Schedule processes","Translate virtual to physical addresses","Manage files","Control I/O"], correct:1 },
            { q:"Aging in scheduling prevents:", options:["Thrashing","Starvation","Deadlock","Race conditions"], correct:1 },
            { q:"A FAT (File Allocation Table) tracks:", options:["CPU usage","Disk block allocation","Process IDs","Network ports"], correct:1 },
        ]
    },
    {
        key: 'marks_english',
        label: 'English',
        icon: 'fa-book-open-reader',
        color: '#10b981',
        description: 'Grammar · Vocabulary · Comprehension · Writing',
        questions: [
            { q:"Synonym of 'Eloquent'?", options:["Shy","Fluent","Confused","Silent"], correct:1 },
            { q:"Correctly spelled word?", options:["Occurence","Ocurrence","Occurrence","Occurrance"], correct:2 },
            { q:"'She ___ to the store yesterday.'", options:["go","goes","went","gone"], correct:2 },
            { q:"Antonym of 'Benevolent'?", options:["Kind","Generous","Malevolent","Humble"], correct:2 },
            { q:"A 'simile' compares using:", options:["Metaphor","Like or as","Personification","Alliteration"], correct:1 },
            { q:"Passive voice of 'She writes a letter':", options:["A letter is written by her","She wrote a letter","A letter was written","She has written"], correct:0 },
            { q:"What is a 'clause'?", options:["A single word","A group of words with subject and verb","A phrase","A punctuation mark"], correct:1 },
            { q:"Which is an abstract noun?", options:["Dog","Table","Freedom","Mountain"], correct:2 },
            { q:"'The sun rises in the east.' — tense?", options:["Past","Future","Simple present","Present continuous"], correct:2 },
            { q:"Identify the conjunction: 'I was tired, but I continued.'", options:["tired","was","but","I"], correct:2 },
            { q:"Which word is a homophone of 'there'?", options:["Thee","Their","Them","Three"], correct:1 },
            { q:"A word that modifies a verb is called:", options:["Adjective","Noun","Adverb","Preposition"], correct:2 },
            { q:"'Procrastinate' means:", options:["To hurry","To delay tasks","To organize","To deny"], correct:1 },
            { q:"Which sentence is grammatically correct?", options:["He don't like it.","He doesn't likes it.","He doesn't like it.","He didn't liked it."], correct:2 },
            { q:"The figure of speech in 'Time is a thief' is:", options:["Simile","Personification","Metaphor","Hyperbole"], correct:2 },
            { q:"'Verbose' means?", options:["Short and sweet","Using more words than needed","Accurate","Vague"], correct:1 },
            { q:"Which is a compound sentence?", options:["She ran.","She ran because it rained.","She ran, and he walked.","Running is fun."], correct:2 },
            { q:"'Ephemeral' means:", options:["Permanent","Short-lived","Huge","Ancient"], correct:1 },
            { q:"What is the plural of 'criterion'?", options:["Criterions","Criterias","Criteria","Criterium"], correct:2 },
            { q:"Identify the preposition: 'The book is on the table.'", options:["book","is","on","table"], correct:2 },
            { q:"'Ubiquitous' best means:", options:["Unique","Found everywhere","Invisible","Ancient"], correct:1 },
            { q:"An 'oxymoron' is:", options:["A logical statement","Contradictory words together","A long metaphor","A type of rhyme"], correct:1 },
            { q:"'I have been waiting for an hour.' — tense?", options:["Simple past","Past perfect","Present perfect continuous","Future perfect"], correct:2 },
            { q:"Which is the correct form: 'Neither the boys ___ happy.'", options:["are","were","is","be"], correct:2 },
            { q:"An 'epithet' is:", options:["A figure of speech","A descriptive phrase for a person","A type of poem","A narrative device"], correct:1 },
            { q:"'Ameliorate' means?", options:["Worsen","Make better","Ignore","Repeat"], correct:1 },
            { q:"Which word is a gerund in: 'Swimming is fun.'?", options:["is","fun","Swimming","None"], correct:2 },
            { q:"The indirect speech of 'He said I am happy' is:", options:["He said he was happy","He says he was happy","He told he is happy","He said I was happy"], correct:0 },
            { q:"A 'protagonist' is:", options:["The villain","The main character","A narrator","A minor character"], correct:1 },
            { q:"Which punctuation ends an exclamatory sentence?", options:["Period","Question mark","Exclamation mark","Comma"], correct:2 },
            { q:"'Loquacious' means:", options:["Quiet","Talkative","Intelligent","Deceptive"], correct:1 },
            { q:"What is a 'thesis statement' in an essay?", options:["The conclusion","The main argument","A quotation","The title"], correct:1 },
            { q:"'The stars danced in the sky.' is an example of:", options:["Simile","Alliteration","Personification","Irony"], correct:2 },
            { q:"Which is correct? 'Between you and ___'", options:["I","me","myself","he"], correct:1 },
            { q:"'Magnanimous' means:", options:["Tiny","Mean","Generous","Boastful"], correct:2 },
            { q:"Identify the adverbial clause: 'She left before he arrived.'", options:["She left","he arrived","before he arrived","left before"], correct:2 },
            { q:"A 'palindrome' reads the same:", options:["Forwards and backwards","In two languages","In rhyme","With synonyms"], correct:0 },
            { q:"The word 'Serendipity' means:", options:["Sadness","Anger","Lucky accident","Planning"], correct:2 },
            { q:"'She is the ___ of the two sisters.' (tall)", options:["taller","tallest","more taller","most tall"], correct:0 },
            { q:"What is the purpose of a 'topic sentence'?", options:["Conclude a paragraph","Introduce the main idea of a paragraph","Ask a question","Provide evidence"], correct:1 },
            { q:"'Cacophony' refers to:", options:["Harmony","Pleasant sound","Harsh sounds","Silence"], correct:2 },
            { q:"Which word is spelled correctly?", options:["Neccessary","Necessary","Necessery","Neccesary"], correct:1 },
            { q:"An 'ellipsis' (...) indicates:", options:["A new sentence","Omission or pause","An error","End of document"], correct:1 },
            { q:"'He gave me advice.' — 'advice' is:", options:["Countable noun","Verb","Uncountable noun","Adjective"], correct:2 },
            { q:"Which sentence uses 'effect' correctly?", options:["The drug effected him.","The effect was dramatic.","He effected the report.","She effected change."], correct:1 },
            { q:"A 'soliloquy' is speech:", options:["To another character","To the audience only","Spoken by a character alone","A group conversation"], correct:2 },
            { q:"'Laconic' describes speech that is:", options:["Long-winded","Brief and to the point","Poetic","Confusing"], correct:1 },
            { q:"Which is the superlative form of 'good'?", options:["Better","Gooder","Goodest","Best"], correct:3 },
            { q:"A 'rhetoric question' expects:", options:["A long answer","A short answer","No answer","A question in return"], correct:2 },
            { q:"'Onomatopoeia' means words that:", options:["Sound like what they describe","Mean the opposite","Rhyme always","Have silent letters"], correct:0 },
        ]
    },
    {
        key: 'marks_physics',
        label: 'Engineering Physics',
        icon: 'fa-atom',
        color: '#8b5cf6',
        description: 'Mechanics · Waves · Optics · Thermodynamics',
        questions: [
            { q:"Newton's first law deals with:", options:["Gravity","Inertia","Action-reaction","Acceleration"], correct:1 },
            { q:"Speed of light in vacuum is approximately:", options:["3×10⁸ m/s","3×10⁶ m/s","3×10¹⁰ m/s","3×10⁴ m/s"], correct:0 },
            { q:"Which quantity has both magnitude and direction?", options:["Mass","Temperature","Velocity","Time"], correct:2 },
            { q:"Ohm's law states V = ?", options:["IR","I/R","I²R","R/I"], correct:0 },
            { q:"The SI unit of force is:", options:["Joule","Pascal","Newton","Watt"], correct:2 },
            { q:"Energy stored in a capacitor is:", options:["CV","½CV²","CV²","2CV"], correct:1 },
            { q:"Which wave does NOT require a medium?", options:["Sound","Water wave","Electromagnetic wave","Seismic wave"], correct:2 },
            { q:"Snell's law relates:", options:["Mass and velocity","Angle of incidence and refraction","Force and acceleration","Charge and potential"], correct:1 },
            { q:"The unit of electric charge is:", options:["Ampere","Volt","Coulomb","Ohm"], correct:2 },
            { q:"First law of thermodynamics states:", options:["Entropy always increases","Energy is conserved","Heat flows from cold to hot","Absolute zero can be reached"], correct:1 },
            { q:"Young's double slit experiment demonstrates:", options:["Wave-particle duality","Interference of light","Photoelectric effect","Diffraction only"], correct:1 },
            { q:"Magnetic flux is measured in:", options:["Tesla","Weber","Gauss","Henry"], correct:1 },
            { q:"The work done by a force is zero when:", options:["Force is maximum","Displacement is perpendicular to force","Velocity is max","Force equals weight"], correct:1 },
            { q:"de Broglie wavelength is given by λ = ?", options:["hf","h/p","E/f","mc²"], correct:1 },
            { q:"The efficiency of a Carnot engine depends on:", options:["Working substance","Engine size","Temperature of reservoirs","Pressure only"], correct:2 },
            { q:"In simple harmonic motion, acceleration is:", options:["Constant","Proportional to displacement","Zero at equilibrium","Maximum at equilibrium"], correct:1 },
            { q:"The photoelectric effect is explained by:", options:["Wave theory","Quantum theory","Classical mechanics","Thermodynamics"], correct:1 },
            { q:"A lens that converges light is called:", options:["Concave","Plane","Convex","Diverging"], correct:2 },
            { q:"Kirchhoff's current law states:", options:["Voltage is constant","Sum of currents at a junction = 0","Resistance is additive","Power = VI"], correct:1 },
            { q:"Which has the highest frequency?", options:["Radio waves","Microwaves","X-rays","Infrared"], correct:2 },
            { q:"An ideal gas obeys:", options:["Van der Waals equation","PV = nRT","Stefan's law","Hooke's law"], correct:1 },
            { q:"The binding energy of a nucleus is due to:", options:["Electromagnetic force","Nuclear strong force","Gravitational force","Weak force"], correct:1 },
            { q:"Escape velocity from Earth is approximately:", options:["7.9 km/s","11.2 km/s","9.8 km/s","3×10⁸ m/s"], correct:1 },
            { q:"Dimensional formula of power is:", options:["MLT⁻²","ML²T⁻³","ML²T⁻²","MLT⁻³"], correct:1 },
            { q:"Polarization proves light is a:", options:["Longitudinal wave","Transverse wave","Standing wave","Sound wave"], correct:1 },
            { q:"Maxwell's equations unify:", options:["Gravity and EM","Electricity and magnetism","Quantum and classical","Nuclear forces"], correct:1 },
            { q:"A transformer works on the principle of:", options:["Electrostatics","Mutual induction","Resonance","Photoelectric effect"], correct:1 },
            { q:"The angle at which total internal reflection occurs is:", options:["Brewster's angle","Critical angle","Snell's angle","Glancing angle"], correct:1 },
            { q:"Stefan-Boltzmann law relates radiated power to:", options:["Frequency","Wavelength","Temperature⁴","Mass"], correct:2 },
            { q:"Heisenberg's uncertainty principle states:", options:["Position and momentum cannot both be precisely known","Energy is not conserved","Light speed varies","Electrons orbit nuclei"], correct:0 },
            { q:"Bohr model describes:", options:["Neutron decay","Electron orbits in hydrogen atom","Nuclear fission","X-ray emission"], correct:1 },
            { q:"The formula for kinetic energy is:", options:["mgh","½mv²","mv","Iω"], correct:1 },
            { q:"Entropy is associated with which law?", options:["Zeroth law","First law","Second law","Third law"], correct:2 },
            { q:"A solenoid with n turns per meter has B = ?", options:["μ₀nI","μ₀nI²","nμ₀/I","μ₀I/n"], correct:0 },
            { q:"Doppler effect relates to change in:", options:["Amplitude","Frequency due to motion","Wavelength only","Speed of wave"], correct:1 },
            { q:"Centripetal acceleration formula:", options:["v/r","v²/r","vr","r/v²"], correct:1 },
            { q:"Radioactive decay follows:", options:["Linear law","Exponential law","Inverse square law","Logarithmic law"], correct:1 },
            { q:"Brewster's angle is where:", options:["Refraction stops","Reflected light is fully polarized","Total reflection occurs","Diffraction is max"], correct:1 },
            { q:"The unit of magnetic field intensity (B) is:", options:["Ampere/meter","Tesla","Weber","Henry/meter"], correct:1 },
            { q:"In nuclear fission:", options:["Small nuclei combine","Large nucleus splits","Electrons are emitted","Protons decay"], correct:1 },
            { q:"Which phenomenon explains the rainbow?", options:["Reflection only","Refraction and dispersion","Diffraction","Interference"], correct:1 },
            { q:"Standing waves occur due to:", options:["Single wave","Superposition of two counter-propagating waves","Diffraction","Reflection only"], correct:1 },
            { q:"Dimensional formula of pressure:", options:["MLT⁻²","ML⁻¹T⁻²","M⁰LT⁻²","ML²T⁻²"], correct:1 },
            { q:"The work function in photoelectric effect represents:", options:["Max energy of photon","Min energy to eject an electron","Wavelength of light","Kinetic energy of electron"], correct:1 },
            { q:"Gauss's law relates electric flux to:", options:["Current","Magnetic field","Enclosed charge","Resistance"], correct:2 },
            { q:"Angular momentum is conserved when:", options:["Force is zero","Net torque is zero","Velocity is constant","Energy is zero"], correct:1 },
            { q:"Lenz's law is a consequence of:", options:["Coulomb's law","Conservation of energy","Newton's third law","Gauss's law"], correct:1 },
            { q:"At 0 K (absolute zero), all molecular motion:", options:["Reaches maximum","Becomes random","Ceases completely","Is undefined"], correct:2 },
            { q:"The four fundamental forces do NOT include:", options:["Gravity","Strong nuclear","Tension","Weak nuclear"], correct:2 },
            { q:"AC circuits use what type of current?", options:["Only positive","Steady DC","Alternating sinusoidal","Pulsating DC"], correct:2 },
        ]
    },
];

const QUESTIONS_PER_TEST = 10; 

const OnlineTests = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // State
    const [currentStep, setCurrentStep] = useState('select');
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [sessionQuestions, setSessionQuestions] = useState([]);
    
    // Exam Engine State
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({}); // { qIndex: selectedOption }
    const [statuses, setStatuses] = useState([]); // 'not_visited', 'unanswered', 'answered', 'marked'
    const [timeLeft, setTimeLeft] = useState(0); 
    const [score, setScore] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const targetId = location.state?.impersonateId || JSON.parse(localStorage.getItem('projexam_user') || '{}')?.id || 1;

    const startQuiz = (subject) => {
        const shuffled = [...subject.questions].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_TEST);
        setSelectedSubject(subject);
        setSessionQuestions(shuffled);
        setCurrentQuestion(0);
        setAnswers({});
        
        const initialStatuses = Array(QUESTIONS_PER_TEST).fill('not_visited');
        initialStatuses[0] = 'unanswered';
        setStatuses(initialStatuses);
        
        setTimeLeft(QUESTIONS_PER_TEST * 60); // 1 minute per question
        setCurrentStep('quiz');
        
        // Attempt Fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch((e) => console.log(e));
        }
    };

    // Timer Logic
    useEffect(() => {
        if (currentStep === 'quiz' && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (currentStep === 'quiz' && timeLeft === 0) {
            submitQuiz(); // Auto submit
        }
    }, [currentStep, timeLeft]);

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSelectOption = (optIdx) => {
        setAnswers(prev => ({ ...prev, [currentQuestion]: optIdx }));
    };

    const handleSaveNext = () => {
        const newStatuses = [...statuses];
        if (answers[currentQuestion] !== undefined) {
            newStatuses[currentQuestion] = 'answered';
        } else {
            newStatuses[currentQuestion] = 'unanswered';
        }
        
        if (currentQuestion < sessionQuestions.length - 1) {
            if (newStatuses[currentQuestion + 1] === 'not_visited') {
                newStatuses[currentQuestion + 1] = 'unanswered';
            }
            setStatuses(newStatuses);
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setStatuses(newStatuses);
        }
    };

    const handleMarkReview = () => {
        const newStatuses = [...statuses];
        newStatuses[currentQuestion] = 'marked';
        if (currentQuestion < sessionQuestions.length - 1) {
            if (newStatuses[currentQuestion + 1] === 'not_visited') {
                newStatuses[currentQuestion + 1] = 'unanswered';
            }
            setStatuses(newStatuses);
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setStatuses(newStatuses);
        }
    };

    const jumpToQuestion = (index) => {
        const newStatuses = [...statuses];
        // Only update current if it wasn't answered or marked 
        if (newStatuses[currentQuestion] !== 'answered' && newStatuses[currentQuestion] !== 'marked') {
            newStatuses[currentQuestion] = answers[currentQuestion] !== undefined ? 'answered' : 'unanswered';
        }
        if (newStatuses[index] === 'not_visited') {
            newStatuses[index] = 'unanswered';
        }
        setStatuses(newStatuses);
        setCurrentQuestion(index);
    };

    const submitQuiz = async () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(e => console.log(e));
        }

        setIsSubmitting(true);
        let correct = 0;
        sessionQuestions.forEach((q, i) => {
            if (answers[i] === q.correct) correct++;
        });
        const finalScore = Math.round((correct / sessionQuestions.length) * 100);
        setScore(finalScore);
        
        try {
            await fetch(`/api/students/${targetId}/update_marks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject: selectedSubject.key, score: finalScore })
            });
        } catch (err) { console.error("Score update failed", err); }
        
        setIsSubmitting(false);
        setCurrentStep('done');
    };

    // Palette Color Map
    const getPaletteColor = (status) => {
        switch(status) {
            case 'answered': return { bg: '#10b981', border: '#059669', color: '#fff' }; // Green
            case 'unanswered': return { bg: '#ef4444', border: '#b91c1c', color: '#fff' }; // Red
            case 'marked': return { bg: '#f59e0b', border: '#d97706', color: '#fff' }; // Yellow
            case 'not_visited': default: return { bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.2)', color: 'var(--text-muted)' }; // Gray
        }
    };

    const counts = {
        answered: statuses.filter(s => s === 'answered').length,
        unanswered: statuses.filter(s => s === 'unanswered').length,
        marked: statuses.filter(s => s === 'marked').length,
        not_visited: statuses.filter(s => s === 'not_visited').length,
    };

    return (
        <PageTransition>
            
            {/* ─── SUBJECT SELECT ─── */}
            <AnimatePresence mode="wait">
                {currentStep === 'select' && (
                    <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                        <div style={{ marginBottom: 30 }}>
                            <h2 style={{ fontSize: '2.4rem', marginBottom: 5, display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Target size={36} color="var(--primary)" /> Online Exam Engine
                            </h2>
                            <p style={{ color: 'var(--text-muted)' }}>
                                Secure Testing Facility. {subjects.reduce((acc, s) => acc + s.questions.length, 0)} questions loaded.
                            </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                            {subjects.map(sub => (
                                <motion.div key={sub.key} whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => startQuiz(sub)}
                                    className="glass-card zoom-hover"
                                    style={{ cursor: 'pointer', padding: 28, border: `1px solid ${sub.color}30`, position: 'relative', overflow: 'hidden' }}
                                >
                                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: 100, height: 100, borderRadius: '50%', background: `${sub.color}15` }} />
                                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${sub.color}20`, border: `1px solid ${sub.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                                        <i className={`fa-solid ${sub.icon}`} style={{ color: sub.color, fontSize: '1.4rem' }} />
                                    </div>
                                    <h3 style={{ marginBottom: 6, fontSize: '1.2rem' }}>{sub.label}</h3>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{sub.description}</p>
                                    <button className="btn btn-primary" style={{ width: '100%', background: sub.color, border: 'none', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                        INITIATE TEST <ShieldAlert size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ─── ACTUAL EXAM INTERFACE ─── */}
                {currentStep === 'quiz' && sessionQuestions.length > 0 && (
                    <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'fixed', inset: 0, padding: '20px', zIndex: 100, overflowY: 'auto' }}>
                        {/* Background over-ride for full focus layer */}
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10, 10, 15, 0.95)', backdropFilter: 'blur(30px)', zIndex: -1 }} />

                        {/* Top App Bar */}
                        <div style={{ background: 'var(--bg-layer-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className={`fa-solid ${selectedSubject.icon}`} style={{ color: selectedSubject.color, fontSize: '1.2rem' }} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>{selectedSubject.label} Terminal</h3>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MOCK EXAMINATION • ID: 894-BETA</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                    <Clock color="#ef4444" size={18} />
                                    <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
                                </div>
                                <button onClick={() => { if(window.confirm('Are you sure you want to end the test?')) submitQuiz(); }} className="btn btn-primary" style={{ background: 'var(--primary)' }}>Submit Test</button>
                            </div>
                        </div>

                        {/* Main Grid: Question Area (left) & Palette (right) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '20px', alignItems: 'start' }}>
                            
                            {/* Question Container */}
                            <div className="glass-card" style={{ padding: '40px', minHeight: '65vh', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Question {currentQuestion + 1}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>+4 / -1</span>
                                </div>
                                
                                <h2 style={{ fontSize: '1.4rem', lineHeight: '1.6', marginBottom: '40px', fontWeight: '500' }}>
                                    {sessionQuestions[currentQuestion].q}
                                </h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
                                    {sessionQuestions[currentQuestion].options.map((opt, i) => (
                                        <div key={i} onClick={() => handleSelectOption(i)} 
                                            style={{ 
                                                padding: '20px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                                                background: answers[currentQuestion] === i ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                                                border: answers[currentQuestion] === i ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.05)',
                                                display: 'flex', alignItems: 'center', gap: '15px' 
                                            }}>
                                            <div style={{ 
                                                width: 30, height: 30, borderRadius: '50%', border: answers[currentQuestion] === i ? '2px solid #3b82f6' : '2px solid rgba(255,255,255,0.2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                background: answers[currentQuestion] === i ? '#3b82f6' : 'transparent'
                                            }}>
                                                <span style={{ color: answers[currentQuestion] === i ? 'white' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold' }}>{['A','B','C','D'][i]}</span>
                                            </div>
                                            <span style={{ fontSize: '1.1rem', color: 'white' }}>{opt}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Control Bar */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <button className="btn btn-outline" onClick={handleMarkReview} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <Flag size={16} /> Mark for Review
                                    </button>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn btn-outline" onClick={() => jumpToQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}><ChevronLeft size={18} /></button>
                                        <button className="btn btn-primary" onClick={handleSaveNext} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            Save & Next <Save size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Question Palette Sidebar */}
                            <div className="glass-card" style={{ padding: '20px', position: 'sticky', top: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
                                    <Map size={18} color="var(--primary)" />
                                    <h4 style={{ margin: 0 }}>Question Palette</h4>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '25px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <div style={{ width: 12, height: 12, borderRadius: '3px', background: '#10b981' }} /> {counts.answered} Answered
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <div style={{ width: 12, height: 12, borderRadius: '3px', background: '#ef4444' }} /> {counts.unanswered} Unanswered
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <div style={{ width: 12, height: 12, borderRadius: '3px', background: '#f59e0b' }} /> {counts.marked} Marked
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <div style={{ width: 12, height: 12, borderRadius: '3px', background: 'rgba(255,255,255,0.2)' }} /> {counts.not_visited} Not Visited
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                    {sessionQuestions.map((_, idx) => {
                                        let styleParams = getPaletteColor(statuses[idx]);
                                        if (currentQuestion === idx) {
                                            styleParams.border = 'white'; // Highlight current
                                            styleParams.color = 'white';
                                        }
                                        return (
                                            <button key={idx} onClick={() => jumpToQuestion(idx)}
                                                style={{ 
                                                    aspectRatio: '1', borderRadius: '8px', border: `2px solid ${styleParams.border}`, background: styleParams.bg, color: styleParams.color, 
                                                    fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', padding: 0
                                                }}>
                                                {idx + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ─── DONE ─── */}
                {currentStep === 'done' && (
                    <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ maxWidth: 520, margin: '0 auto', padding: 50, textAlign: 'center' }}>
                        <div style={{ width: 100, height: 100, borderRadius: '50%', background: score >= 70 ? 'rgba(16,185,129,0.1)' : score >= 40 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', border: `2px solid ${score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'}` }}>
                            <i className={`fa-solid ${score >= 70 ? 'fa-trophy' : score >= 40 ? 'fa-star-half-stroke' : 'fa-rotate'} fa-3x`} style={{ color: score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444' }} />
                        </div>
                        <h2 style={{ marginBottom: 10 }}>Session Result Computed</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 10 }}>
                            Module: <strong style={{ color: selectedSubject?.color }}>{selectedSubject?.label}</strong>
                        </p>
                        <div style={{ fontSize: '4.5rem', fontWeight: 900, color: score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444', marginBottom: 8 }}>
                            {score}%
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
                            Score synchronized successfully to neural database. Review analytics for depth insights.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <button className="btn btn-outline" onClick={() => setCurrentStep('select')}>Terminate Session</button>
                            <button className="btn btn-primary" onClick={() => navigate('/exams-results', { state: { impersonateId: targetId } })}>Route to Deep Analytics</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default OnlineTests;
