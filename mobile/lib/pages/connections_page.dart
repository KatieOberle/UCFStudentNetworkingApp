import 'package:flutter/material.dart';

class ConnectionsPage extends StatefulWidget {
  final VoidCallback? onBackClick;

  const ConnectionsPage({
    super.key,
    this.onBackClick,
  });

  @override
  State<ConnectionsPage> createState() => _ConnectionsPageState();
}

class _ConnectionsPageState extends State<ConnectionsPage> {
  String activeTab = 'connections';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('KnightLink'),
        actions: [
          TextButton(
            onPressed: widget.onBackClick ??
                () => Navigator.of(context).pop(),
            child: const Text('Back to Profile'),
          ),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1200),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'My Network',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 12),
                const Text(
                  'Manage your connections, review requests, '
                  'and grow your UCF network.',
                ),
                const SizedBox(height: 32),
                Wrap(
                  spacing: 12,
                  runSpacing: 8,
                  children: [
                    _tabButton('My Connections', 'connections'),
                    _tabButton('Pending Requests', 'pending'),
                    _tabButton('Sent Requests', 'sent'),
                  ],
                ),
                const SizedBox(height: 24),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(48),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    color: Theme.of(context).colorScheme.surface,
                  ),
                  child: Center(
                    child: Text(
                      activeTab == 'connections'
                          ? 'Your connections will appear here.'
                          : activeTab == 'pending'
                              ? 'Incoming connection requests will appear here.'
                              : 'Your sent connection requests will appear here.',
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _tabButton(String label, String tab) {
    final isActive = activeTab == tab;

    return FilledButton(
      onPressed: () {
        setState(() {
          activeTab = tab;
        });
      },
      style: FilledButton.styleFrom(
        backgroundColor: isActive
            ? const Color(0xFF561787)
            : const Color(0xFF34233F),
        foregroundColor: Colors.white,
      ),
      child: Text(label),
    );
  }
}
