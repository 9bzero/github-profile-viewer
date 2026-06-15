import{useState}from'react'
  interface Repo{id:number;name:string;description:string|null;language:string|null;stargazers_count:number;forks_count:number;html_url:string;updated_at:string}
  interface Profile{login:string;name:string|null;bio:string|null;avatar_url:string;followers:number;following:number;public_repos:number;location:string|null;blog:string|null;html_url:string}
  const COLORS:Record<string,string>={TypeScript:'#3178c6',JavaScript:'#f1e05a',Python:'#3572A5',Rust:'#dea584',Go:'#00ADD8',HTML:'#e34c26',CSS:'#563d7c',React:'#61dafb',default:'#64748b'}
  export default function App(){
    const[user,setUser]=useState('9bzero')
    const[profile,setProfile]=useState<Profile|null>(null)
    const[repos,setRepos]=useState<Repo[]>([])
    const[loading,setLoading]=useState(false)
    const[err,setErr]=useState('')
    const search=async()=>{
      if(!user.trim())return
      setLoading(true);setErr('');setProfile(null);setRepos([])
      try{
        const[p,r]=await Promise.all([
          fetch(`https://api.github.com/users/${user.trim()}`).then(r=>r.json()),
          fetch(`https://api.github.com/users/${user.trim()}/repos?sort=updated&per_page=12`).then(r=>r.json())
        ])
        if(p.message)throw new Error(p.message)
        setProfile(p);setRepos(Array.isArray(r)?r:[])
      }catch(e:any){setErr(e.message)}finally{setLoading(false)}
    }
    const langs=repos.reduce((acc:Record<string,number>,r)=>{if(r.language)acc[r.language]=(acc[r.language]||0)+1;return acc},{})
    return(
      <div style={{minHeight:'100vh',background:'#0f172a',fontFamily:'Inter,system-ui,sans-serif',color:'#e2e8f0',padding:'2rem'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h1 style={{fontWeight:800,fontSize:'1.75rem',marginBottom:'1.5rem',color:'#f8fafc',textAlign:'center'}}>🔍 GitHub Profile Viewer</h1>
          <div style={{display:'flex',gap:'0.75rem',marginBottom:'2rem',maxWidth:480,margin:'0 auto 2rem'}}>
            <input value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()} placeholder="GitHub username..." style={{flex:1,background:'#111827',border:'1px solid #334155',borderRadius:8,padding:'0.7rem 1rem',color:'#e2e8f0',outline:'none',fontSize:'0.95rem'}}/>
            <button onClick={search} disabled={loading} style={{padding:'0.7rem 1.5rem',background:'#0ea5e9',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700,fontSize:'0.9rem'}}>
              {loading?'…':'Search'}
            </button>
          </div>
          {err&&<div style={{background:'#450a0a',border:'1px solid #7f1d1d',borderRadius:8,padding:'1rem',color:'#fca5a5',textAlign:'center',marginBottom:'1.5rem'}}>❌ {err}</div>}
          {profile&&(
            <>
              <div style={{background:'#111827',border:'1px solid #1e293b',borderRadius:16,padding:'2rem',marginBottom:'1.5rem',display:'flex',gap:'1.5rem',alignItems:'flex-start',flexWrap:'wrap'}}>
                <img src={profile.avatar_url} alt="avatar" style={{width:80,height:80,borderRadius:'50%',border:'3px solid #38bdf8'}}/>
                <div style={{flex:1}}>
                  <h2 style={{fontWeight:700,color:'#f1f5f9',marginBottom:'0.25rem'}}>{profile.name||profile.login}</h2>
                  <div style={{color:'#38bdf8',fontSize:'0.9rem',marginBottom:'0.5rem'}}>@{profile.login}</div>
                  {profile.bio&&<p style={{color:'#94a3b8',fontSize:'0.9rem',marginBottom:'0.75rem'}}>{profile.bio}</p>}
                  <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
                    {[{label:'Repos',val:profile.public_repos},{label:'Followers',val:profile.followers},{label:'Following',val:profile.following}].map(({label,val})=>(
                      <div key={label} style={{textAlign:'center'}}>
                        <div style={{fontWeight:700,color:'#38bdf8'}}>{val}</div>
                        <div style={{color:'#94a3b8',fontSize:'0.75rem'}}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                  {Object.entries(langs).sort(([,a],[,b])=>b-a).slice(0,5).map(([lang,count])=>(
                    <span key={lang} style={{padding:'0.25rem 0.7rem',background:'#0f172a',border:`1px solid ${COLORS[lang]||COLORS.default}`,borderRadius:12,fontSize:'0.75rem',color:COLORS[lang]||COLORS.default}}>{lang} ({count})</span>
                  ))}
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1rem'}}>
                {repos.map(r=>(
                  <a key={r.id} href={r.html_url} target="_blank" style={{background:'#111827',border:'1px solid #1e293b',borderRadius:10,padding:'1rem',textDecoration:'none',color:'inherit',display:'block'}}>
                    <div style={{fontWeight:600,color:'#38bdf8',marginBottom:'0.4rem',fontSize:'0.9rem'}}>{r.name}</div>
                    <p style={{color:'#94a3b8',fontSize:'0.8rem',marginBottom:'0.75rem',lineHeight:1.5,height:'2.4em',overflow:'hidden'}}>{r.description||'No description'}</p>
                    <div style={{display:'flex',gap:'1rem',fontSize:'0.75rem',color:'#64748b'}}>
                      {r.language&&<span style={{color:COLORS[r.language]||COLORS.default}}>● {r.language}</span>}
                      <span>★ {r.stargazers_count}</span>
                      <span>⑂ {r.forks_count}</span>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
          {!profile&&!loading&&!err&&(
            <div style={{textAlign:'center',color:'#475569',padding:'4rem 0'}}>
              <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🔍</div>
              <p>Enter a GitHub username to explore their profile</p>
            </div>
          )}
        </div>
      </div>
    )
  }