import React, {useState} from "react";
import { ChevronLeft } from "lucide-react";
import Mathematics from "../../assets/images/mathematics.jpg";
import English from "../../assets/images/english.jpg";
import Chemistry from "../../assets/images/chemistry.jpg";
import Biology from "../../assets/images/biology.jpg";
import Physics from "../../assets/images/physics.jpg";
import Literature from "../../assets/images/english-literature.jpg";

const subjects = [
  { name: "Mathematics", image: Mathematics },
  { name: "English Language", image: Literature },
  { name: "Biology", image: Biology },
  { name: "Chemistry", image: Biology },
  { name: "Physics", image: Physics },
  { name: "English Literature", image: Literature },
]

const StudentLibraryPage = () => {
  const [eachsubject, setEachSubject] = useState(null);

  if (eachsubject) {
    return (
      <StudentSubjectPage 
        subject={eachsubject}
        setSubject={setEachSubject}
      />
    )
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <button className="btn btn-primary rounded-full bg-white text-primary border-none shadow-md hover:bg-primary hover:text-white">
          <ChevronLeft />
          Back
        </button>
        <p className="font-bold">All Subjects</p>
      </div>

      <div className="m-4 mt-10 flex flex-wrap gap-4 cursor-pointer">
        {subjects.map((subj) => (
          <div
            key={subj.name}
            className="card w-70 shadow-sm bg-gray-50"
            onClick={() => setEachSubject(subj)}
          >
            <div>
              <img
                src={subj.image}
                alt={subj.name}
                className="rounded-xl h-48 w-full object-cover"
              />
            </div>
            <div className="p-3">
              <p>{subj.name}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StudentLibraryPage;

const StudentSubjectPage = ({ subject, setSubject }) => {
  const handleBack = () => {
    setSubject(null);
  }
  return (
    <>
      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="btn btn-primary rounded-full bg-white text-primary border-none shadow-md hover:bg-primary hover:text-white">
          <ChevronLeft />
          Back
        </button>
        <p className="font-bold">{subject.name}</p>
      </div>
      <div className="p-5">
        <p className="font-bold">Check Back for {subject.name} content</p>
      </div>
    </>
  );
}

