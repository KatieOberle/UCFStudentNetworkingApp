import 'package:flutter/material.dart';
import 'communities_page.dart';
import '../main.dart';
import 'login_page.dart';

class HomePage extends StatelessWidget {
  const HomePage({
    super.key,
    required this.token,
    this.onDiscussionsClick,
    this.onSearchClick,
    this.onCommunitiesClick,
    this.onProfileClick,
  });

  final String token;
  final VoidCallback? onDiscussionsClick;
  final VoidCallback? onSearchClick;
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
                  onPressed: () {},
                  child: const Text('Home'),
                ),
                TextButton(
                  onPressed: onDiscussionsClick,
                  child: const Text('Discussions'),
                ),
                TextButton(
                  onPressed: onSearchClick,
                  child: const Text('Search'),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => CommunitiesPage(
                          onHomeClick: () {
                            Navigator.pop(context);
                          },
                        ),
                      ),
                    );
                  },
                  child: const Text('Communities'),
                ),
                TextButton(
                  onPressed: onProfileClick,
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
                        'Welcome to KnightLink',
                        style: Theme.of(context).textTheme.headlineMedium,
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Connect with UCF students, join discussions, discover communities, and grow your network.',
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Discussions',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          FilledButton(
                            onPressed: () {},
                            child: const Text('Create Thread'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(48),
                        child: const Center(
                          child: Text('No discussions to display yet.'),
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