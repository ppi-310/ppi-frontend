export default function FormalBases() {
  return (
    <main className="page-wrapper">
      
      <div className="section">
        <div className="main-container_s1 hero">
          <div className="w-layout-blockcontainer w-container">
            <h1 className="heading-4">
              <strong>Formal Bases for Process Performance Indicators (PPI)</strong>
            </h1>
            <p className="paragraph-2">
              Access the complete mathematical formalization and conceptual framework behind the main process performance indicators (PPIs). An essential reference for researchers, analysts, and process improvement teams.
            </p>
            {/* OJO: Aquí deberás poner la ruta de tu PDF cuando lo tengas */}
            <a href="#" className="button-3 w-button">
              Download Formal Bases
            </a>
          </div>
        </div>
      </div>

      <div className="section-description-audience">
        <div className="main-container_s1 hero what-s-inside">
          <div className="w-layout-blockcontainer w-container">
            <h1>What’s Inside?</h1>
          </div>
          <p>
            This document contains formal definitions and mathematical notation for working with process performance indicators (PPIs), covering key dimensions such as:<br /><br />
            <strong>General:</strong> counts, resources, and roles<br /><br />
            <strong>Time:</strong> lead time, service time, waiting times<br /><br />
            <strong>Cost:</strong> direct, labor, inventory, and overhead costs<br /><br />
            <strong>Quality &amp; Flexibility:</strong> rework, optionality, variant coverage<br /><br />
            Includes a rigorous structure for event logs, cases, activities, resources, and attributes, following leading academic standards.
          </p>
        </div>
      </div>

      <div className="section-description-audience what-s-it-for">
        <div className="main-container_s2 hero what-s-it-for">
          <h1 className="heading-5">Who Is It For?</h1>
          <div className="w-layout-blockcontainer w-container">
            <p>
              Researchers and students in process mining, management, and analytics<br /><br />
              Professionals in process improvement and digital transformation<br /><br />
              IT, quality, operations, and project teams seeking to measure and compare process performance
            </p>
          </div>
        </div>
      </div>

      <div className="last_update">Last updated: 05/2025</div>
      
    </main>
  );
}