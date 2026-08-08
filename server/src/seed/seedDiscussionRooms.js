const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("../config/db");

const Company = require(
  "../modules/companies/company.model"
);

const Role = require(
  "../modules/roles/role.model"
);

const DiscussionRoom = require(
  "../modules/discussions/discussion.model"
);


/*
========================================
Seed / Migrate Discussion Rooms
========================================
*/

const seedDiscussionRooms = async () => {

  try {

    await connectDB();

    console.log(
      "Connected to MongoDB"
    );


    /*
    ========================================
    Get all existing roles
    ========================================
    */

    const roles = await Role.find()
      .populate("company");

    console.log(
      `Found ${roles.length} roles`
    );


    let created = 0;
    let migrated = 0;
    let skipped = 0;


    /*
    ========================================
    Process every role
    ========================================
    */

    for (const role of roles) {

      /*
      --------------------------------------
      Check company
      --------------------------------------
      */

      if (!role.company) {

        console.log(
          `⚠️ Skipping role: ${role.title}`
        );

        console.log(
          "Company not found."
        );

        continue;
      }


      /*
      --------------------------------------
      Company + Role information
      --------------------------------------
      */

      const companyName =
        role.company.name;

      const roleName =
        role.title;

      const roomName =
        `${companyName} ${roleName}`;


      /*
      ========================================
      First check by roleId
      ========================================
      */

      let existingRoom =
        await DiscussionRoom.findOne({
          roleId: role._id,
        });


      if (existingRoom) {

        console.log(
          `⏭️ Already exists: ${roomName}`
        );

        skipped++;

        continue;
      }


      /*
      ========================================
      Check old room by roomName
      ========================================
      
      This handles rooms created by
      the OLD seed file.
      */

      existingRoom =
        await DiscussionRoom.findOne({
          roomName: roomName,
        });


      if (existingRoom) {

        console.log(
          `🔄 Migrating old room: ${roomName}`
        );


        /*
        --------------------------------------
        Add roleId to old room
        --------------------------------------
        */

        existingRoom.roleId =
          role._id;


        /*
        --------------------------------------
        Update information
        --------------------------------------
        */

        existingRoom.company =
          companyName;

        existingRoom.role =
          roleName;

        existingRoom.roomName =
          roomName;


        /*
        --------------------------------------
        Save migrated room
        --------------------------------------
        */

        await existingRoom.save();


        console.log(
          `✅ Migrated: ${roomName}`
        );

        migrated++;

        continue;
      }


      /*
      ========================================
      No room exists
      Create new room
      ========================================
      */

      await DiscussionRoom.create({

        roleId: role._id,

        company: companyName,

        role: roleName,

        roomName: roomName,

        description:
          `Discuss ${companyName} ${roleName} `
          + `interview preparation, questions, `
          + `experiences and tips with other students.`,

      });


      console.log(
        `✅ Created: ${roomName}`
      );

      created++;

    }


    /*
    ========================================
    Final Result
    ========================================
    */

    console.log(
      "\n================================"
    );

    console.log(
      "Discussion Room Seeding Complete"
    );

    console.log(
      "================================"
    );

    console.log(
      `Created: ${created}`
    );

    console.log(
      `Migrated: ${migrated}`
    );

    console.log(
      `Skipped: ${skipped}`
    );

    console.log(
      `Total Roles: ${roles.length}`
    );


    process.exit(0);


  } catch (error) {

    console.error(
      "❌ Discussion Room Seed Error:",
      error
    );

    process.exit(1);

  }

};


seedDiscussionRooms();