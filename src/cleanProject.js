const moment = require('moment');

const DATE_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss ZZ';

function cleanProject(project) {
    const cleanedProject = {
        ...project,
        photo: project.photo ? project.photo.full : null,
        creatorId: project.creator ? project.creator.id : null,
        creatorName: project.creator ? project.creator.name : null,
        creatorAvatar: project.creator ? project.creator.avatar.medium : null,
        creatorUrl: project.creator && project.creator.urls ? project.creator.urls.web.user : null,
        locationId: project.location ? project.location.id : null,
        locationName: project.location ? project.location.displayable_name : null,
        categoryId: project.category ? project.category.id : null,
        categoryName: project.category ? project.category.name : null,
        categorySlug: project.category ? project.category.slug : null,
        url: (project.urls && project.urls.web && project.urls.web.project) || null,
        title: project.name,
        description: project.blurb,
        link: (project.urls && project.urls.web && project.urls.web.project) || null,
        pubDate: moment.unix(project.launched_at).format(DATE_FORMAT),
        created_at_formatted: moment.unix(project.created_at).format(DATE_FORMAT),
        launched_at_formatted: moment.unix(project.launched_at).format(DATE_FORMAT),
    };

    delete cleanedProject.creator;
    delete cleanedProject.location;
    delete cleanedProject.category;
    delete cleanedProject.urls;
    delete cleanedProject.profile;

    return cleanedProject;
}

module.exports = cleanProject;
