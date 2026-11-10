import 'package:flutter/material.dart';

class CommunitiesPage extends StatelessWidget {
  const CommunitiesPage({
    super.key,
    this.onHomeClick,
    this.onDiscussionsClick,
    this.onSearchClick,
    this.onProfileClick,
  });

  final VoidCallback? onHomeClick;
  final VoidCallback? onDiscussionsClick;
  final VoidCallback? onSearchClick;
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
                TextButton(onPressed: onHomeClick, child: const Text('Home')),
                TextButton(onPressed: onDiscussionsClick, child: const Text('Discussions')),
                TextButton(onPressed: onSearchClick, child: const Text('Search')),
                TextButton(onPressed: () {}, child: const Text('Communities')),
                TextButton(onPressed: onProfileClick, child: const Text('Profile')),
              ],
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1200),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Communities', style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 12),
                const Text('Discover student communities or create one around shared interests.'),
                const SizedBox(height: 20),
                FilledButton(onPressed: () {}, child: const Text('Create Community')),
                const SizedBox(height: 32),
                Row(
                  children: [
                    const Expanded(
                      child: TextField(
                        decoration: InputDecoration(hintText: 'Search communities...'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    FilledButton(onPressed: () {}, child: const Text('Search')),
                  ],
                ),
                const SizedBox(height: 20),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(48),
                  child: const Center(child: Text('Search for communities to see results.')),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
