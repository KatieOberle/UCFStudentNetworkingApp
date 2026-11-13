import 'package:flutter/material.dart';
import 'home_page.dart';
import 'discussions_page.dart';
import 'communities_page.dart';
import 'profile_page.dart';
import 'student_profile_page.dart';

class SearchPage extends StatelessWidget {
  const SearchPage({
    super.key,
    this.onHomeClick,
    this.onDiscussionsClick,
    this.onCommunitiesClick,
    this.onProfileClick,
  });

  final VoidCallback? onHomeClick;
  final VoidCallback? onDiscussionsClick;
  final VoidCallback? onCommunitiesClick;
  final VoidCallback? onProfileClick;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('KnightLink'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(50),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                TextButton(
                  onPressed: () {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const HomePage(token: ''),
                      ),
                      (route) => false,
                    );
                  },
                  child: const Text('Home'),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const DiscussionsPage(),
                      ),
                    );
                  },
                  child: const Text('Discussions'),
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text('Search'),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const CommunitiesPage(),
                      ),
                    );
                  },
                  child: const Text('Communities'),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const ProfilePage(),
                      ),
                    );
                  },
                  child: const Text('Profile'),
                ),
              ],
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1200),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Search Students',
                        style: Theme.of(context).textTheme.headlineMedium,
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Find students by name, major, career interests, or company affiliations.',
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Expanded(
                            child: TextField(
                              decoration: InputDecoration(
                                hintText: 'Search students...',
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          FilledButton(
                            onPressed: () {},
                            child: const Text('Search'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => StudentProfilePage(
                                student: null,
                                onBackClick: () => Navigator.pop(context),
                              ),
                            ),
                          );
                        },
                        child: const Text('View Student Profile'),
                      ),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(48),
                        child: const Center(
                          child: Text('Search for students to see results.'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}