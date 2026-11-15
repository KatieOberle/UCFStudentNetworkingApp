import 'package:flutter/material.dart';
import 'home_page.dart';
import 'discussions_page.dart';
import 'search_page.dart';
import 'communities_page.dart';
import 'edit_profile_page.dart';
import 'connections_page.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({
    super.key,
    this.onHomeClick,
    this.onDiscussionsClick,
    this.onSearchClick,
    this.onCommunitiesClick,
  });

  final VoidCallback? onHomeClick;
  final VoidCallback? onDiscussionsClick;
  final VoidCallback? onSearchClick;
  final VoidCallback? onCommunitiesClick;

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
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const SearchPage(),
                      ),
                    );
                  },
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
                  onPressed: () {},
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
                  Text(
                    'My Profile',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Manage your student information, interests, and networking profile.',
                  ),
                  const SizedBox(height: 20),
                  FilledButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => EditProfilePage(
                            onBackClick: () => Navigator.pop(context),
                          ),
                        ),
                      );
                    },
                    child: const Text('Edit Profile'),
                  ),
                  const SizedBox(height: 12),
                  FilledButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ConnectionsPage(
                            onBackClick: () => Navigator.pop(context),
                          ),
                        ),
                      );
                    },
                    child: const Text('My Connections'),
                  ),
                  const SizedBox(height: 32),
                  Wrap(
                    spacing: 16,
                    runSpacing: 16,
                    children: [
                      profileCard('Name', 'Your name will appear here.'),
                      profileCard('Major', 'Your major will appear here.'),
                      profileCard('Career Interests', 'Your career interests will appear here.'),
                      profileCard('Company Affiliations', 'Your company affiliations will appear here.'),
                      profileCard('Contact Information', 'Your contact information will appear here.'),
                      profileCard('My Discussions', 'Your discussion threads will appear here.'),
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

  Widget profileCard(String title, String description) {
    return SizedBox(
      width: 350,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Text(description),
            ],
          ),
        ),
      ),
    );
  }
}
