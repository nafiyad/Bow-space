USE [master]
GO
/****** Object:  Database [BowCourseRegistration]    Script Date: 12/10/2024 5:49:37 PM ******/
CREATE DATABASE [BowCourseRegistration]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'BowCourseRegistration', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.SQLEXPRESS\MSSQL\DATA\BowCourseRegistration.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'BowCourseRegistration_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.SQLEXPRESS\MSSQL\DATA\BowCourseRegistration_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [BowCourseRegistration] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [BowCourseRegistration].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [BowCourseRegistration] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET ARITHABORT OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [BowCourseRegistration] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [BowCourseRegistration] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [BowCourseRegistration] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET  ENABLE_BROKER 
GO
ALTER DATABASE [BowCourseRegistration] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [BowCourseRegistration] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [BowCourseRegistration] SET  MULTI_USER 
GO
ALTER DATABASE [BowCourseRegistration] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [BowCourseRegistration] SET DB_CHAINING OFF 
GO
ALTER DATABASE [BowCourseRegistration] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [BowCourseRegistration] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [BowCourseRegistration] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [BowCourseRegistration] SET QUERY_STORE = OFF
GO
USE [BowCourseRegistration]
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
USE [BowCourseRegistration]
GO
/****** Object:  Table [dbo].[CourseRegistrations]    Script Date: 12/10/2024 5:49:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CourseRegistrations](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[studentId] [int] NULL,
	[courseId] [varchar](20) NULL,
	[status] [varchar](20) NULL,
	[grade] [varchar](2) NULL,
	[registrationDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[studentId] ASC,
	[courseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Courses]    Script Date: 12/10/2024 5:49:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Courses](
	[id] [varchar](20) NOT NULL,
	[code] [varchar](20) NOT NULL,
	[name] [varchar](100) NOT NULL,
	[term] [varchar](10) NOT NULL,
	[program] [varchar](10) NULL,
	[description] [text] NULL,
	[capacity] [int] NULL,
	[createdAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Messages]    Script Date: 12/10/2024 5:49:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Messages](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[senderId] [int] NOT NULL,
	[receiverId] [int] NOT NULL,
	[subject] [nvarchar](255) NOT NULL,
	[content] [ntext] NOT NULL,
	[createdAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Programs]    Script Date: 12/10/2024 5:49:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Programs](
	[code] [varchar](10) NOT NULL,
	[name] [varchar](100) NOT NULL,
	[duration] [varchar](20) NOT NULL,
	[description] [text] NULL,
	[feesDomestic] [decimal](10, 2) NULL,
	[feesInternational] [decimal](10, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StudentDetails]    Script Date: 12/10/2024 5:49:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StudentDetails](
	[userId] [int] NOT NULL,
	[phone] [varchar](20) NULL,
	[birthday] [date] NULL,
	[program] [varchar](10) NULL,
	[status] [varchar](20) NULL,
	[createdAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[userId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 12/10/2024 5:49:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[firstName] [varchar](50) NOT NULL,
	[lastName] [varchar](50) NOT NULL,
	[email] [varchar](100) NOT NULL,
	[username] [varchar](50) NOT NULL,
	[password] [varchar](255) NOT NULL,
	[role] [varchar](10) NOT NULL,
	[createdAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [idx_registration_course]    Script Date: 12/10/2024 5:49:37 PM ******/
CREATE NONCLUSTERED INDEX [idx_registration_course] ON [dbo].[CourseRegistrations]
(
	[courseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [idx_registration_student]    Script Date: 12/10/2024 5:49:37 PM ******/
CREATE NONCLUSTERED INDEX [idx_registration_student] ON [dbo].[CourseRegistrations]
(
	[studentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [idx_course_program]    Script Date: 12/10/2024 5:49:37 PM ******/
CREATE NONCLUSTERED INDEX [idx_course_program] ON [dbo].[Courses]
(
	[program] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [idx_messages_created]    Script Date: 12/10/2024 5:49:37 PM ******/
CREATE NONCLUSTERED INDEX [idx_messages_created] ON [dbo].[Messages]
(
	[createdAt] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [idx_messages_receiver]    Script Date: 12/10/2024 5:49:37 PM ******/
CREATE NONCLUSTERED INDEX [idx_messages_receiver] ON [dbo].[Messages]
(
	[receiverId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [idx_messages_sender]    Script Date: 12/10/2024 5:49:37 PM ******/
CREATE NONCLUSTERED INDEX [idx_messages_sender] ON [dbo].[Messages]
(
	[senderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [idx_student_program]    Script Date: 12/10/2024 5:49:37 PM ******/
CREATE NONCLUSTERED INDEX [idx_student_program] ON [dbo].[StudentDetails]
(
	[program] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[CourseRegistrations] ADD  DEFAULT ('Enrolled') FOR [status]
GO
ALTER TABLE [dbo].[CourseRegistrations] ADD  DEFAULT (getdate()) FOR [registrationDate]
GO
ALTER TABLE [dbo].[Courses] ADD  DEFAULT ((30)) FOR [capacity]
GO
ALTER TABLE [dbo].[Courses] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[StudentDetails] ADD  DEFAULT ('Active') FOR [status]
GO
ALTER TABLE [dbo].[StudentDetails] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[CourseRegistrations]  WITH CHECK ADD FOREIGN KEY([courseId])
REFERENCES [dbo].[Courses] ([id])
GO
ALTER TABLE [dbo].[CourseRegistrations]  WITH CHECK ADD FOREIGN KEY([studentId])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Courses]  WITH CHECK ADD FOREIGN KEY([program])
REFERENCES [dbo].[Programs] ([code])
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD FOREIGN KEY([receiverId])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD FOREIGN KEY([senderId])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Receiver] FOREIGN KEY([receiverId])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Receiver]
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Sender] FOREIGN KEY([senderId])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Sender]
GO
ALTER TABLE [dbo].[StudentDetails]  WITH CHECK ADD FOREIGN KEY([program])
REFERENCES [dbo].[Programs] ([code])
GO
ALTER TABLE [dbo].[StudentDetails]  WITH CHECK ADD FOREIGN KEY([userId])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[CourseRegistrations]  WITH CHECK ADD CHECK  (([status]='Completed' OR [status]='Dropped' OR [status]='Enrolled'))
GO
ALTER TABLE [dbo].[Courses]  WITH CHECK ADD CHECK  (([term]='Fall' OR [term]='Summer' OR [term]='Spring' OR [term]='Winter'))
GO
ALTER TABLE [dbo].[StudentDetails]  WITH CHECK ADD CHECK  (([status]='Graduated' OR [status]='Inactive' OR [status]='Active'))
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD CHECK  (([role]='student' OR [role]='admin'))
GO
USE [master]
GO
ALTER DATABASE [BowCourseRegistration] SET  READ_WRITE 
GO

-- Add if not exists
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Programs')
BEGIN
    CREATE TABLE Programs (
        code VARCHAR(10) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        duration VARCHAR(20) NOT NULL,
        description TEXT,
        feesDomestic DECIMAL(10,2),
        feesInternational DECIMAL(10,2)
    );

    -- Insert initial programs
    INSERT INTO Programs (code, name, duration, description, feesDomestic, feesInternational) VALUES
    ('SD-DIP', 'Software Development - Diploma', '2 years', 'Comprehensive software development program', 15000.00, 25000.00),
    ('SD-CERT', 'Software Development - Certificate', '1 year', 'Focused software development certification', 8000.00, 15000.00),
    ('SD-PD', 'Software Development - Post-Diploma', '1 year', 'Advanced software development studies', 10000.00, 18000.00);
END

-- Ensure proper foreign key constraints
ALTER TABLE StudentDetails
ADD CONSTRAINT FK_StudentDetails_Program
FOREIGN KEY (program) REFERENCES Programs(code);
