import React from 'react'
import "../styles/home.scss"

function Home() {
  return (
    <main className='home'>
      <section className='interview-card'>
        <div className='card-header'>
          <p className='eyebrow'>Interview Preparation</p>
          <h1>Generate your interview report</h1>
          <p className='subtitle'>
            Paste a job description, upload your resume, and describe yourself to receive tailored technical questions,
            behavioral questions, a match score, and a preparation plan.
          </p>
        </div>

        <form className='interview-form'>
          <div className='form-grid'>
            <div className='field-group'>
              <label htmlFor='jobDescription'>Job Description</label>
              <textarea
                id='jobDescription'
                name='jobDescription'
                placeholder='Paste the job description here...'
              />
            </div>

            <div className='side-panel'>
              <div className='field-group'>
                <div className='field-title-row'>
                  <label htmlFor='resume'>Resume</label>
                  <span className='helper'>PDF only</span>
                </div>
                <label className='upload-box' htmlFor='resume'>
                  <span className='upload-icon'>⬆</span>
                  <span className='upload-text'>Upload Resume</span>
                  <span className='upload-hint'>Click to browse or drag and drop</span>
                </label>
                <input id='resume' name='resume' type='file' accept='.pdf' />
              </div>

              <div className='field-group'>
                <label htmlFor='selfDescription'>Self Description</label>
                <textarea
                  id='selfDescription'
                  name='selfDescription'
                  placeholder='Share your background, strengths, and experience...'
                />
              </div>

              <button type='button' className='button primary-button'>Generate Interview Report</button>
            </div>
          </div>
        </form>
      </section>
    </main>
  )
}

export default Home