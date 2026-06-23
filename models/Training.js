const mongoose = require("mongoose")

const { Schema } = mongoose;

const trainingSchema = new Schema(
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
        sujet: {
            type: String
        },
        requirements: [{
            type: String,
            enum: [
                "Être étudiant(e) ou apprenant(e)",
                "Connaissances de base dans le domaine",
                "Motivation et engagement",
                "Avoir un ordinateur portable",
                "Connexion Internet (si formation en ligne)",
                "CV à jour",
                "Avoir réalisé des projets personnels ou académiques",
                "Disponibilité pendant toute la durée de la formation",
                "Esprit d’équipe",
                "Bonnes compétences en communication",
            ]
        }],
        type: {
            type: String,
            enum: ["Bootcamp", "Formation", "Atelier", "Certification", "Formation en ligne"],
            default: "Bootcamp",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const Training = mongoose.model("Training", trainingSchema);

module.exports = Training;