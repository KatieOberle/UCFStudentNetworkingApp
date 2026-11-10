import 'package:flutter/material.dart';

class DiscussionsPage extends StatelessWidget {
  const DiscussionsPage({
    super.key,
    this.onHomeClick,
    this.onSearchClick,
    this.onCommunitiesClick,
    this.onProfileClick,
  });

  final VoidCallback? onHomeClick;
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
                  onPressed: onHomeClick,
                  child: const Text('Home'),
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text('Discussions'),
                ),
                TextButton(
                  onPressed: onSearchClick,
                  child: const Text('Search'),
                ),
                TextButton(
                  onPressed: onCommunitiesClick,
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
                        'Discussions',
                        style: Theme.of(context).textTheme.headlineMedium,
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Search existing threads, join conversations, or start your own.',
                      ),
                      const SizedBox(height: 20),
                      FilledButton(
                        onPressed: () {},
                        child: const Text('Create Thread'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  Row(
                    children: [
                      const Expanded(
                        child: TextField(
                          decoration: InputDecoration(
                            hintText: 'Search discussions...',
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
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(48),
                    child: const Center(
                      child: Text('No discussions to display yet.'),
                    ),
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
