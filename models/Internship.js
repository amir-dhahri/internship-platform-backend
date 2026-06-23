const mongoose = require("mongoose")

const { Schema } = mongoose;

const internshipSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true,
        },
        startDate: {
            type: String,
            required: true,
        },
        endDate: {
            type: String,
            required: true,
        },
        location: {
            type: String
        },
        workMode: {
            type: String,
            enum: ["Présentiel", "Hybride", "À distance"],
            default: "Présentiel"
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: false
        },
        companySupervisor: {
            type: Schema.Types.ObjectId,
            ref: "CompanySupervisor",
            required: false
        },
        academicSupervisor: {
            type: Schema.Types.ObjectId,
            ref: "AcademicSupervisor",
            required: false
        },
        topic: {
            type: String
        },
        requirements: [{
            type: String,
            enum: ["Être étudiant(e)",
                "Diplôme en cours (informatique ou domaine similaire)",
                "CV obligatoire",
                "Lettre de motivation",
                "Avoir réalisé des projets académiques",
                "Portfolio (GitHub ou projets personnels)",
                "Connaissances en développement web",
                "Travail en équipe",
                "Bonnes compétences en communication",
                "Disponibilité pour la durée du stage",]
        }],
        type: {
            type: String,
            enum: ["Stage d'été", "Stage de fin d'études", "Temps partiel"],
            default: "Stage de fin d'études",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const Internship = mongoose.model("Internship", internshipSchema);

module.exports = Internship;