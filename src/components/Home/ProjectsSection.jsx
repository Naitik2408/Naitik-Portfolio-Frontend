import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Code, Layers, Star, ArrowRight, Eye, Tag, Cpu, Monitor, Server, Database, Smartphone, PenTool, List } from "lucide-react";

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(["all"]);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const projectsRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const projectVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    },
    hover: { 
      y: -8,
      transition: { duration: 0.3 }
    }
  };

  // Category icon mapping
  const categoryIcons = {
    "web": Monitor,
    "mobile": Smartphone,
    "backend": Server,
    "frontend": Code,
    "design": PenTool,
    "database": Database,
    "all": Layers
  };

  // Default icon for categories
  const getIconForCategory = (category) => {
    return categoryIcons[category.toLowerCase()] || categoryIcons.all;
  };

  // Generate gradient based on category
  const getCategoryGradient = (category) => {
    switch(category?.toLowerCase()) {
      case "web": return "from-cyan-500 to-blue-600";
      case "mobile": return "from-orange-500 to-amber-600";
      case "backend": return "from-indigo-500 to-purple-600";
      case "frontend": return "from-blue-500 to-indigo-600"; 
      case "design": return "from-fuchsia-500 to-pink-600";
      case "database": return "from-emerald-500 to-teal-600";
      default: return "from-blue-500 to-indigo-600";
    }
  };

  // Fetch projects from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/portfolio`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects data');
        }
        
        const data = await response.json();
        const projectsData = data.projects || [];
        
        // Set projects
        setProjects(projectsData);
        
        // Extract unique categories from projects
        const uniqueCategories = new Set(projectsData.map((project) => project.category || "misc"));
        setCategories(["all", ...Array.from(uniqueCategories)]);
        
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.message);
        // Load fallback data if API fails
        loadFallbackData();
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fallback data if API fails
  const loadFallbackData = () => {
    const fallbackProjects = [
      {
        _id: "1",
        title: "E-Commerce Platform",
        description: "A full-featured online shopping platform with payment integration and inventory management.",
        imageUrl: "https://via.placeholder.com/600/400/2563eb/FFFFFF?text=E-Commerce+Platform",
        category: "web",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        demoLink: "#",
        codeLink: "#",
      },
      {
        _id: "2",
        title: "Task Management App",
        description: "A productivity application for teams to manage tasks, projects and deadlines efficiently.",
        imageUrl: "https://via.placeholder.com/600/400/4f46e5/FFFFFF?text=Task+Management",
        category: "web",
        technologies: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS"],
        demoLink: "#",
        codeLink: "#",
      },
      {
        _id: "3",
        title: "Fitness Tracker Mobile App",
        description: "A cross-platform mobile application for tracking workouts, nutrition and health metrics.",
        imageUrl: "https://via.placeholder.com/600/400/f97316/FFFFFF?text=Fitness+Tracker",
        category: "mobile",
        technologies: ["React Native", "GraphQL", "Firebase"],
        demoLink: "#",
        codeLink: "#",
      },
      {
        _id: "4",
        title: "Portfolio Website Template",
        description: "A customizable portfolio template for developers and designers with dark/light mode.",
        imageUrl: "https://via.placeholder.com/600/400/db2777/FFFFFF?text=Portfolio+Template",
        category: "design",
        technologies: ["HTML", "CSS", "JavaScript", "GSAP"],
        demoLink: "#",
        codeLink: "#",
      },
      {
        _id: "5",
        title: "Content Management System",
        description: "A headless CMS solution for managing digital content across multiple platforms.",
        imageUrl: "https://via.placeholder.com/600/400/6366f1/FFFFFF?text=CMS+System",
        category: "backend",
        technologies: ["Node.js", "Express", "MongoDB", "JWT"],
        demoLink: "#",
        codeLink: "#",
      },
      {
        _id: "6",
        title: "Weather Dashboard",
        description: "Real-time weather information visualization with historical data analysis.",
        imageUrl: "https://via.placeholder.com/600/400/06b6d4/FFFFFF?text=Weather+Dashboard",
        category: "web",
        technologies: ["React", "D3.js", "OpenWeatherAPI", "Tailwind CSS"],
        demoLink: "#",
        codeLink: "#",
      },
    ];
    
    setProjects(fallbackProjects);
    setCategories(["all", "web", "mobile", "design", "backend"]);
  };

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  // Smooth scroll to projects when filter changes
  // useEffect(() => {
  //   if (!loading && projectsRef.current) {
  //     const yOffset = -100;
  //     const y = projectsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
  //     window.scrollTo({ top: y, behavior: 'smooth' });
  //   }
  // }, [activeFilter, loading]);

  // Get a random technology highlight color
  const getRandomTechColor = () => {
    const colors = [
      "bg-indigo-400/20 text-indigo-200 border-indigo-400/30",
      "bg-cyan-400/20 text-cyan-200 border-cyan-400/30",
      "bg-blue-400/20 text-blue-200 border-blue-400/30",
      "bg-purple-400/20 text-purple-200 border-purple-400/30",
      "bg-emerald-400/20 text-emerald-200 border-emerald-400/30"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading) {
    return (
      <section id="projects" className="homepage-section py-24 md:py-32 overflow-hidden text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[400px] relative z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-300"></div>
            <p className="mt-4 text-indigo-200 animate-pulse">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && projects.length === 0) {
    return (
      <section id="projects" className="homepage-section py-24 md:py-32 overflow-hidden text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Projects</h2>
            <div className="mt-2 h-1 w-24 bg-indigo-400 mx-auto"></div>
            <div className="mt-8 p-8 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-red-400/20 max-w-lg mx-auto">
              <p className="text-red-300">Failed to load projects: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="homepage-section py-24 md:py-32 overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-400/20 text-indigo-200 font-medium text-sm border border-indigo-400/30">
              <Star className="h-3.5 w-3.5 mr-1.5 text-yellow-300" />
              My Work
            </span>
            <span className="h-1 w-1 rounded-full bg-indigo-300"></span>
            <span className="text-indigo-200 text-sm font-light">Portfolio Projects</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-white-cyan-indigo" style={{ fontFamily: "'Clash Display', 'Montserrat', sans-serif" }}>
            Featured Projects
          </h2>
          <div className="mt-6 text-lg text-slate-300 max-w-3xl mx-auto" style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}>
            Explore my portfolio of projects that showcase my skills, creativity, and problem-solving approach
            across various domains and technologies.
          </div>
        </motion.div>

        {/* Filter Controls */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Categories Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-4 md:mb-0">
              {categories.map((category) => {
                const CategoryIcon = getIconForCategory(category);
                return (
                  <motion.button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    whileHover={{ y: -3 }}
                    whileTap={{ y: 0 }}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium capitalize transition-all duration-300 flex items-center ${
                      activeFilter === category
                        ? `bg-gradient-to-r ${getCategoryGradient(category)} text-white shadow-md`
                        : "bg-white/10 text-slate-200 border border-white/10 hover:border-white/30 hover:bg-white/20 hover:shadow-sm backdrop-blur-md"
                    }`}
                  >
                    <CategoryIcon className={`h-4 w-4 ${activeFilter === category ? "text-white" : "text-slate-300"} mr-2`} />
                    {category === "all" ? "All Projects" : category}
                  </motion.button>
                );
              })}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex justify-center">
              <div className="bg-white/10 border border-white/20 rounded-full p-1 shadow-sm backdrop-blur-md">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-full ${viewMode === "grid" ? "bg-indigo-500/50 text-white" : "text-slate-300 hover:text-white hover:bg-white/10"}`}
                  aria-label="Grid view"
                >
                  <Layers className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-full ${viewMode === "list" ? "bg-indigo-500/50 text-white" : "text-slate-300 hover:text-white hover:bg-white/10"}`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Display */}
        <div ref={projectsRef}>
          <AnimatePresence mode="wait">
            {/* Grid View */}
            {viewMode === "grid" && (
              <motion.div 
                key="grid-view"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                {filteredProjects.map((project) => {
                  const isHovered = hoveredProject === project._id;
                  const categoryGradient = getCategoryGradient(project.category || "");
                  const CategoryIcon = getIconForCategory(project.category || "");
                  
                  return (
                    <motion.div
                      key={project._id}
                      variants={projectVariants}
                      onHoverStart={() => setHoveredProject(project._id)}
                      onHoverEnd={() => setHoveredProject(null)}
                      whileHover="hover"
                      className="backdrop-blur-xl bg-white/10 rounded-2xl overflow-hidden shadow-lg border border-white/20 transition-all group"
                    >
                      {/* Project Image with Overlay */}
                      <div className="relative aspect-w-16 aspect-h-9">
                        <img
                          src={project.imageUrl || "https://via.placeholder.com/600/400/4f46e5/FFFFFF?text=Project"} 
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target;
                            target.src = "https://via.placeholder.com/600/400/4f46e5/FFFFFF?text=Project"; 
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 via-indigo-900/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                        
                        {/* Category Bubble */}
                        <div className="absolute top-4 left-4 flex items-center">
                          <div className={`p-2 rounded-full bg-gradient-to-br ${categoryGradient} text-white shadow-md`}>
                            <CategoryIcon className="h-4 w-4" />
                          </div>
                          {isHovered && (
                            <motion.span 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="ml-2 text-xs font-medium text-white capitalize px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm"
                            >
                              {project.category || "project"}
                            </motion.span>
                          )}
                        </div>
                        
                        {/* Action Buttons that appear on hover */}
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={{ opacity: 0 }}
                          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {project.demoLink && (
                            <a
                              href={project.demoLink}
                              className="p-3 bg-white rounded-full text-indigo-600 hover:bg-indigo-50 shadow-lg transform hover:scale-110 transition-transform duration-200"
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Live Demo"
                            >
                              <Eye className="h-5 w-5" />
                            </a>
                          )}
                          {project.codeLink && (
                            <a
                              href={project.codeLink}
                              className="p-3 bg-white rounded-full text-indigo-600 hover:bg-indigo-50 shadow-lg transform hover:scale-110 transition-transform duration-200"
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Source Code"
                            >
                              <Github className="h-5 w-5" />
                            </a>
                          )}
                        </motion.div>
                      </div>
                      
                      {/* Project Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">{project.title}</h3>
                        <p className="text-slate-300 mb-4 line-clamp-2">{project.description}</p>
                        
                        {/* Technology Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies && project.technologies.map((tech, index) => (
                            <span
                              key={`${tech}-${index}`}
                              className={`px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-sm border transition-all hover:-translate-y-1 ${getRandomTechColor()}`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        
                        {/* Project Links - visible in mobile or when not hovered on desktop */}
                        <div className="flex space-x-4 mt-4 md:opacity-100 lg:opacity-70 group-hover:opacity-100 transition-opacity">
                          {project.demoLink && (
                            <a
                              href={project.demoLink}
                              className="inline-flex items-center text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-1.5" />
                              Live Demo
                            </a>
                          )}
                          {project.codeLink && (
                            <a
                              href={project.codeLink}
                              className="inline-flex items-center text-sm font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="h-4 w-4 mr-1.5" />
                              Source Code
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
            
            {/* List View */}
            {viewMode === "list" && (
              <motion.div 
                key="list-view"
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                {filteredProjects.map((project) => {
                  const categoryGradient = getCategoryGradient(project.category || "");
                  const CategoryIcon = getIconForCategory(project.category || "");
                  
                  return (
                    <motion.div
                      key={project._id}
                      variants={projectVariants}
                      whileHover="hover"
                      className="backdrop-blur-xl bg-white/10 rounded-xl overflow-hidden border border-white/20 transition-all group flex flex-col md:flex-row shadow-md hover:shadow-xl"
                    >
                      {/* Project Image */}
                      <div className="relative md:w-1/3 aspect-video md:aspect-square">
                        <img
                          src={project.imageUrl || "https://via.placeholder.com/400/400/4f46e5/FFFFFF?text=Project"} 
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target;
                            target.src = "https://via.placeholder.com/400/400/4f46e5/FFFFFF?text=Project"; 
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 via-indigo-900/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                        
                        {/* Category Indicator */}
                        <div className="absolute top-4 left-4">
                          <div className={`p-2 rounded-full bg-gradient-to-br ${categoryGradient} text-white shadow-md`}>
                            <CategoryIcon className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Project Content */}
                      <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-center">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">{project.title}</h3>
                          {project.category && (
                            <span className="text-xs font-medium text-indigo-200 capitalize px-2.5 py-1 rounded-full bg-indigo-400/20 border border-indigo-400/30">
                              {project.category}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 mb-4">{project.description}</p>
                        
                        {/* Technology Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies && project.technologies.map((tech, index) => (
                            <span
                              key={`${tech}-${index}`}
                              className={`px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-sm border transition-all hover:-translate-y-1 ${getRandomTechColor()}`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        
                        {/* Project Links */}
                        <div className="flex space-x-4 mt-2">
                          {project.demoLink && (
                            <a
                              href={project.demoLink}
                              className="inline-flex items-center text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-1.5" />
                              Live Demo
                            </a>
                          )}
                          {project.codeLink && (
                            <a
                              href={project.codeLink}
                              className="inline-flex items-center text-sm font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="h-4 w-4 mr-1.5" />
                              Source Code
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* View All Projects Button */}
        {projects.length > 6 && (
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="/projects"
              className="inline-flex items-center px-8 py-4 rounded-xl text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1"
            >
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </motion.div>
        )}
        
        {/* Enhanced Featured Project Highlight */}
        <motion.div 
          className="mt-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            {/* Background Effects for Featured Project */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 opacity-30 blur-xl"></div>
            <div className="absolute inset-0 rounded-2xl bg-grid-white/5 bg-[length:20px_20px]"></div>
            
            <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center px-4 py-1.5 mb-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <Star className="h-4 w-4 text-yellow-300 mr-2" />
                    <span className="text-sm font-medium text-white">Featured Project</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Clash Display', 'Montserrat', sans-serif" }}>Build with a Modern Stack</h3>
                  <p className="text-indigo-100 mb-6">
                    My projects leverage cutting-edge technologies and best practices to deliver
                    exceptional user experiences and robust performance. From responsive
                    frontends to scalable backend systems, I create complete solutions
                    that meet the demands of today's digital landscape.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {/* Extract unique technologies from all projects */}
                    {Array.from(
                      new Set(
                        projects
                          .flatMap(project => project.technologies || [])
                          .slice(0, 5)
                      )
                    ).map((tech, index) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-md border border-white/10 hover:bg-white/30 transition-colors cursor-default"
                      >
                        <Cpu className="h-3.5 w-3.5 mr-1.5 text-indigo-200" />
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                  <motion.a
                    href="#contact"
                    className="inline-flex items-center px-8 py-4 border border-indigo-400/30 text-base font-medium rounded-xl text-white bg-indigo-900/30 hover:bg-indigo-900/50 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 self-start"
                    whileHover={{ y: -3 }}
                    whileTap={{ y: 0 }}
                  >
                    Start a Project
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.a>
                </div>
                <div className="relative flex items-center justify-center p-8 lg:p-12">
                  {projects.length > 0 && (
                    <motion.div
                      initial={{ x: 100, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="relative"
                    >
                      {/* Animated gradient border */}
                      <div className="absolute inset-0 p-1 rounded-xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-400 opacity-80 animate-border-pulse"></div>
                      
                      <div className="absolute inset-0 m-0.5 rounded-xl overflow-hidden">
                        <img
                          src={projects[0].imageUrl || "https://via.placeholder.com/600/400/4f46e5/FFFFFF?text=Featured+Project"}
                          alt="Featured project"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target;
                            target.src = "https://via.placeholder.com/600/400/4f46e5/FFFFFF?text=Featured+Project"; 
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                      </div>
                      
                      {/* Floating Feature Tags */}
                      <div className="absolute -top-4 -right-4 backdrop-blur-md bg-white/10 p-3 rounded-xl shadow-lg border border-white/20">
                        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                          <Tag className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="absolute -bottom-4 -left-4 backdrop-blur-md bg-white/10 p-3 rounded-xl shadow-lg border border-white/20">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                          <Code className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;