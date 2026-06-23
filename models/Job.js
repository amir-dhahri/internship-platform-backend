const mongoose = require("mongoose")

const { Schema } = mongoose;

const jobSchema = new Schema(
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
            enum: ["Présentiel", "Télétravail", "Hybride (présentiel + télétravail)", "Freelance / Remote", "Temps partiel en présentiel"],
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
        poste: {
            type: String
        },
        requirements: [{
            type: String,
            enum: ["Diplôme requis", "Expérience professionnelle", "Stage ou projet académique", "Travail en équipe", "Autonomie", "Bonnes compétences en communication", "Compétences techniques spécifiques", "Maîtrise des langues", "Résolution de problèmes", "Portfolio / projets requis"],
        }],
        status: {
            type: String,
            enum: ["en attente", "approuvé", "en cours", "terminé", "rejeté"],
            default: "en attente",
            required: true,
        },
        type: {
            type: String,
            enum: ["CDI", "CDD", "stage", "alternance", "freelance", "saisonnier", "temps-partiel"],
            default: "CDI",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;