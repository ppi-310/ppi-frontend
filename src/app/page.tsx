export default function Home() {
  return (
    <main>
      

      <div className="main-section_home">
        <div className="main-container_s1">
          <div className="content-wrap_center">
            <div id="w-node-abe3f579-0ad8-1862-b11d-d386b00b685a-7c6c31da" className="content-wrap_center mw-800">
              <div className="subheader cta-color">HAPLAB</div>
              <div className="spacer_xs"></div>
              <h1 className="h1">Welcome to the Ultimate <span className="brand-color">Process Performance Indicators</span></h1>
              <div className="spacer_xs"></div>
              <p className="paragraph mw-400">A page for visualizing a collection of indicators</p>
              <div className="spacer_l"></div>
              <a href="indicators" className="button home w-button">Explore</a>
            </div>
          </div>
        </div>
      </div>

      <div className="main-section_home second-color">
        <div className="main-container_s1">
          <div id="w-node-_5a47d43e-731f-62de-f8fd-79cb4f978be1-7c6c31da" className="content-wrap_center">
            <h2 className="h2">Welcome to Process Performance Insights</h2>
            <div className="spacer_m"></div>
            <p className="paragraph">This platform allows you to visualize and analyze Process Performance Indicators (PPIs) across multiple dimensions, providing deeper insights into your business processes. Here, we focus on five critical dimensions to evaluate process performance: <strong className="bold-text">General</strong>, <strong className="bold-text-2">Time</strong>, <strong className="bold-text-3">Cost</strong>, <strong className="bold-text-4">Quality</strong>, and <strong className="bold-text-5">Flexibility</strong>.</p>
            <div className="spacer_xxl"></div>
            <h3 className="h3">What Are Process Performance Indicators (PPIs)?</h3>
            <div className="spacer_m"></div>
            <p className="paragraph">Process Performance Indicators (PPIs) are quantifiable metrics used to assess how efficiently and effectively a business process is performing. These indicators are essential for understanding the strengths and weaknesses of a process. Traditionally, PPIs are calculated at the process level, providing a single performance metric for an entire process. However, with this platform, you can drill down into specific process instances, allowing you to analyze performance at a much more granular level and understand how each process variant contributes to overall performance.</p>
          </div>
        </div>
      </div>

      <div className="main-section_home">
        <div className="main-container_s1">
          <div className="w-layout-grid grid_1-2 reverse">
            <div id="w-node-ba83af13-d9db-9f64-cc4a-7a13ef88fef2-7c6c31da" className="content-wrap">
              <h2 className="h2">The Devil&#x27;s Quadrangle: Navigating Trade-offs in Process Performance</h2>
              <div className="spacer_m"></div>
              <p className="paragraph">At the heart of process performance analysis is the <strong className="bold-text-6">Devil&#x27;s Quadrangle (DQ)</strong>—a framework that highlights the inherent trade-offs between four key performance dimensions: <strong>Time</strong>, <strong>Cost</strong>, <strong>Flexibility</strong>, and <strong>Quality</strong>.</p>
              <div className="spacer_l"></div>
            </div>
            
            <div id="w-node-_5a47d43e-731f-62de-f8fd-79cb4f978bea-7c6c31da" className="w-layout-grid grid_features">
              <div id="w-node-_5a47d43e-731f-62de-f8fd-79cb4f978beb-7c6c31da" className="card_small no-borders">
                <div className="icon w-embed">
                  <svg width="420" height="420" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <line x1="12" y1="12" x2="12" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="spacer_xs"></div>
                <h4 className="h4">Time</h4>
                <div className="spacer_xxs"></div>
                <p className="paragraph">How quickly a process is executed.</p>
              </div>

              <div id="w-node-_7817eaa7-ab74-ab6b-5e92-dd0ebb4c833d-7c6c31da" className="card_small no-borders">
                <div className="icon w-embed">
                  <svg width="420" height="420" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <text x="50%" y="50%" fontSize="14" fontFamily="Arial, sans-serif" fill="currentColor" textAnchor="middle" dy=".3em">$</text>
                  </svg>
                </div>
                <div className="spacer_xs"></div>
                <h4 className="h4">Cost</h4>
                <div className="spacer_xxs"></div>
                <p className="paragraph">The financial resources required to execute the process.</p>
              </div>

              <div id="w-node-de4b3672-39bd-c277-63f2-d8e487ba3260-7c6c31da" className="card_small no-borders">
                <img src="https://cdn.prod.website-files.com/66fd99b624ab2c3d7c6c30ad/674f509e4ca5b95ec1929f19_64653.png" loading="lazy" alt="" className="icon"/>
                <div className="spacer_xs"></div>
                <h4 className="h4">Flexibility</h4>
                <div className="spacer_xxs"></div>
                <p className="paragraph">The ability of the process to adapt to changes or variations.</p>
              </div>

              <div id="w-node-f3019a9a-7cf4-985c-32c6-6357a87cab41-7c6c31da" className="card_small no-borders">
                <div className="icon w-embed">
                  <svg width="420" height="420" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="spacer_xs"></div>
                <h4 className="h4">Quality</h4>
                <div className="spacer_xxs"></div>
                <p className="paragraph">The degree to which the process delivers the desired outcome without errors or defects.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
