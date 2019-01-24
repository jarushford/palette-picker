const projects = [
  {
    name: 'Project 1',
    palettes: [{
      name: 'Colors!',
      color1: 'D5D9CF',
      color2: 'B19B75',
      color3: 'B14120',
      color4: '187685',
      color5: '7962B8'
    }]
  },
  {
    name: 'Project 2',
    palettes: [{
      name: 'Other Colors!',
      color1: '45D9FF',
      color2: 'B69B75',
      color3: '714120',
      color4: '18B685',
      color5: '7962A8'
    }]
  }
]

const createProject = (knex, project) => {
  return knex('projects').insert({
    name: project.name
  }, 'id')
  .then(projectID => {
    let palettePromises = []

    project.palettes.forEach(palette => {
      palettePromises.push(
        createPalette(knex, { ...palette, project_id: projectID[0] })
      )
    })
    
    return Promise.all(palettePromises)
  })
}

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette)
}

exports.seed = (knex, Promise) => {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = []

      projects.forEach(project => {
        projectPromises.push(createProject(knex, project))
      })

      return Promise.all(projectPromises)
    })
    .catch(error => console.log(`Error seeding data: ${error}`)) 
}
