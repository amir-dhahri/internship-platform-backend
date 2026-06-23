const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { globalErrHandler, notFoundError } = require("../middlewares/globalErrHandler");
const departmentRouter = require("../routes/departmentRouter");
const acdemicLevelRouter = require("../routes/academicLevelsRouter");
const academicCoordinatorRouter = require("../routes/academicCoordinatorsRouter");
const cookieParser = require("cookie-parser");
const acdemicYearRouter = require("../routes/academicYearsRouter");
const academicSupervisorsRouter = require("../routes/academicSupervisorsRouter");
const studentRouter = require("../routes/studentRouter");
const companyCoordinatorRouter = require("../routes/companyCoordinatorsRouter");
const companySupervisorRouter = require("../routes/companySupervisorsRouter");
const companyDepartmentRouter = require("../routes/companyDepartmentRouter");
const internshipApplicationRouter = require("../routes/internshipApplicationRouter");

const app = express();

//=====Middleware=====//

app.use(morgan("dev"));
app.use(cookieParser())
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true,
}));

//=====Routes=====//

// app.use("api/v1/admins", adminRouter);
// app.use("api/v1/students", studentRouter);
app.use("/api/v1/internship-applications", internshipApplicationRouter)
app.use("/api/v1/departments/company", companyDepartmentRouter)
app.use("/api/v1/departments", departmentRouter);
app.use("/api/v1/academic-levels", acdemicLevelRouter)
app.use("/api/v1/academic-coordinators", academicCoordinatorRouter)
app.use("/api/v1/academic-years", acdemicYearRouter)
app.use("/api/v1/academic-supervisors", academicSupervisorsRouter)
app.use("/api/v1/students", studentRouter)
app.use("/api/v1/company-coordinators", companyCoordinatorRouter);
app.use("/api/v1/company-supervisors", companySupervisorRouter);
//=====Error Middlewares=====//
app.use(notFoundError);
app.use(globalErrHandler);

module.exports = app;