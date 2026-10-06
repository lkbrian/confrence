/**
 * Bible facts shown on /happening, one per session (recycled across the three days).
 *
 * Standard for this list: every entry states only what the cited passage says, or a
 * well-documented historical fact with its source. No estimates, traditions or interpretations
 * presented as fact. Scripture wording follows the NIV. Check any new entry against its reference.
 */
export type BibleFact = { fact: string; ref: string }

export const bibleFacts: BibleFact[] = [
  // Mentorship across generations (the conference theme)
  { fact: 'Joshua had been Moses’ aide since his youth, and was later commissioned to succeed him.', ref: 'Numbers 11:28; 27:18–23' },
  { fact: 'Joshua was filled with the spirit of wisdom because Moses had laid his hands on him.', ref: 'Deuteronomy 34:9' },
  { fact: 'Before Elijah was taken up, Elisha asked to inherit a double portion of his spirit.', ref: '2 Kings 2:9' },
  { fact: 'Paul addressed Timothy as “my true son in the faith.”', ref: '1 Timothy 1:2' },
  { fact: 'Timothy’s sincere faith first lived in his grandmother Lois and his mother Eunice.', ref: '2 Timothy 1:5' },
  { fact: 'Paul told Timothy to entrust what he had heard to reliable people who would be qualified to teach others: four generations of teaching in one verse.', ref: '2 Timothy 2:2' },
  { fact: 'Eli taught the boy Samuel to answer God’s call: “Speak, Lord, for your servant is listening.”', ref: '1 Samuel 3:8–10' },
  { fact: 'The apostles named Joseph of Cyprus “Barnabas,” which means “son of encouragement.”', ref: 'Acts 4:36' },
  { fact: 'When the disciples in Jerusalem were afraid of Saul, Barnabas brought him to the apostles and vouched for him.', ref: 'Acts 9:26–27' },
  { fact: 'Priscilla and Aquila invited Apollos into their home and explained the way of God to him more adequately.', ref: 'Acts 18:26' },
  { fact: 'Paul instructed older women to teach younger women, and Titus to set an example for young men.', ref: 'Titus 2:3–7' },
  { fact: '“One generation commends your works to another; they tell of your mighty acts.”', ref: 'Psalm 145:4' },
  { fact: '“Your old men will dream dreams, your young men will see visions.”', ref: 'Joel 2:28' },
  { fact: 'Jethro told Moses the work was too heavy to handle alone and advised him to appoint capable leaders.', ref: 'Exodus 18:17–23' },
  { fact: '“As iron sharpens iron, so one person sharpens another.”', ref: 'Proverbs 27:17' },
  { fact: 'Ruth told her mother-in-law Naomi, “Where you go I will go, and where you stay I will stay.”', ref: 'Ruth 1:16' },
  { fact: 'Ruth, a Moabite, was the great-grandmother of King David.', ref: 'Ruth 4:13–17' },
  { fact: 'At 85, Caleb said he was still as strong as the day Moses sent him out, and asked for the hill country.', ref: 'Joshua 14:10–12' },
  { fact: 'Josiah became king at eight years old, and later led Judah in renewing the covenant.', ref: '2 Kings 22:1; 23:1–3' },
  { fact: 'Paul told Timothy, “Don’t let anyone look down on you because you are young, but set an example.”', ref: '1 Timothy 4:12' },

  // Africa in the Bible
  { fact: 'Joseph took the child Jesus and Mary to Egypt for safety, staying until Herod died.', ref: 'Matthew 2:13–15' },
  { fact: 'Simon of Cyrene, a city in North Africa, was made to carry Jesus’ cross.', ref: 'Mark 15:21' },
  { fact: 'Philip baptised an Ethiopian official in charge of the treasury of the Kandake, queen of the Ethiopians.', ref: 'Acts 8:27–38' },
  { fact: 'Apollos, “a learned man” with a thorough knowledge of the Scriptures, was a native of Alexandria in Egypt.', ref: 'Acts 18:24' },
  { fact: 'At Pentecost, people from Egypt and the parts of Libya near Cyrene heard the apostles in their own languages.', ref: 'Acts 2:5–11' },
  { fact: 'Among the prophets and teachers of the church in Antioch were Simeon called Niger and Lucius of Cyrene.', ref: 'Acts 13:1' },
  { fact: 'Pharaoh put Joseph in charge of the whole land of Egypt, and all the world came to Egypt to buy grain.', ref: 'Genesis 41:41–57' },

  // Numbers and records in Scripture
  { fact: 'Psalm 117 is the shortest chapter in the Bible, with two verses.', ref: 'Psalm 117' },
  { fact: 'Psalm 119 is the longest chapter in the Bible, with 176 verses.', ref: 'Psalm 119' },
  { fact: 'Psalm 119 is an acrostic: its 22 stanzas of eight verses each follow the 22 letters of the Hebrew alphabet.', ref: 'Psalm 119' },
  { fact: '“Jesus wept” is the shortest verse in most English Bibles.', ref: 'John 11:35' },
  { fact: 'Methuselah lived 969 years, the longest lifespan recorded in Scripture.', ref: 'Genesis 5:27' },
  { fact: 'Obadiah is the shortest book of the Old Testament: one chapter of 21 verses.', ref: 'Obadiah 1' },
  { fact: 'Abraham was 100 years old when his son Isaac was born.', ref: 'Genesis 21:5' },
  { fact: 'Solomon spoke 3,000 proverbs, and his songs numbered 1,005.', ref: '1 Kings 4:32' },
  { fact: 'God told Noah to build the ark 300 cubits long, 50 cubits wide and 30 cubits high.', ref: 'Genesis 6:15' },
  { fact: 'Moses stayed on Mount Sinai forty days and forty nights.', ref: 'Exodus 24:18' },
  { fact: 'Jesus fasted forty days and forty nights in the wilderness.', ref: 'Matthew 4:1–2' },
  { fact: 'Jonah was inside the fish three days and three nights.', ref: 'Jonah 1:17' },
  { fact: 'Turning water into wine at Cana was the first of the signs through which Jesus revealed his glory.', ref: 'John 2:1–11' },
  { fact: 'The disciples were first called Christians at Antioch.', ref: 'Acts 11:26' },
  { fact: 'Paul wrote Ephesians, Philippians, Colossians and Philemon as a prisoner.', ref: 'Ephesians 3:1; Philippians 1:13; Colossians 4:18; Philemon 1' },
  { fact: 'The book of Esther never mentions God by name.', ref: 'Esther 1–10' },
  { fact: 'Parts of Daniel and Ezra were written in Aramaic; the rest of the Old Testament is in Hebrew, and the New Testament in Greek.', ref: 'Daniel 2:4b–7:28; Ezra 4:8–6:18; 7:12–26' },

  // How the Bible came to us (history, with sources)
  { fact: 'The Protestant Bible has 66 books: 39 in the Old Testament and 27 in the New.', ref: 'The biblical canon' },
  { fact: 'Luke wrote both the Gospel of Luke and Acts, which together make up more of the New Testament by word count than any other author’s writings.', ref: 'Luke 1:1–4; Acts 1:1' },
  { fact: 'The chapter divisions used in our Bibles today are credited to Stephen Langton, Archbishop of Canterbury, in the early 13th century.', ref: 'History of the Bible' },
  { fact: 'Verse numbers in the New Testament were introduced by the Paris printer Robert Estienne in his 1551 Greek New Testament.', ref: 'History of the Bible' },
  { fact: 'The Gutenberg Bible, completed around 1455 in Mainz, was the first major book printed in Europe with movable metal type.', ref: 'History of printing' },
  { fact: 'The Great Isaiah Scroll, found among the Dead Sea Scrolls in 1947, is a complete copy of Isaiah written over 2,000 years ago.', ref: 'Dead Sea Scrolls, Israel Museum' },
]
